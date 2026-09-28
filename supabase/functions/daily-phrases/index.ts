import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

async function generatePhrases(apiKey: string, day: string, signal: AbortSignal) {
  const prompt = `Today is ${day}. Create 12 fresh, natural British English phrases for accent training (listen-and-repeat practice).
Mix everyday topics (seasonal, travel, food, work, small talk, polite requests) and target tricky sounds: th, r/l, vowels, broad a, consonant clusters, silent letters, intonation.
Each phrase: one sentence, 8-18 words, British spelling. Give a short category label (2-3 words) naming the sound focus.
Return ONLY JSON: {"phrases":[{"text":"...","category":"..."}]}`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      input: prompt,
      stream: true,
      store: false,
      reasoning: { effort: "low", summary: "auto" },
      include: ["reasoning.encrypted_content"],
      text: {
        format: {
          type: "json_schema",
          name: "phrases",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["phrases"],
            properties: {
              phrases: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["text", "category"],
                  properties: { text: { type: "string" }, category: { type: "string" } },
                },
              },
            },
          },
        },
      },
    }),
  });

  if (!res.ok || !res.body) {
    const err = new Error(`AI error ${res.status}: ${await res.text()}`) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buf = "";
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += value;
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const evt = JSON.parse(data);
        if (evt.type === "response.output_text.delta") text += evt.delta;
        if (evt.type === "error" || evt.type === "response.failed") throw new Error("AI stream failed");
      } catch (e) {
        if (e instanceof Error && e.message === "AI stream failed") throw e;
      }
    }
  }
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed.phrases) || parsed.phrases.length === 0) throw new Error("Empty AI output");
  return parsed.phrases;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const day = new Date().toISOString().slice(0, 10);
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: existing } = await supabase.from("daily_phrases").select("phrases").eq("day", day).maybeSingle();
  if (existing) return json({ day, phrases: existing.phrases });

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "AI is not configured" }, 500);

  try {
    const phrases = await generatePhrases(apiKey, day, req.signal);
    await supabase.from("daily_phrases").upsert({ day, phrases }, { onConflict: "day", ignoreDuplicates: true });
    const { data } = await supabase.from("daily_phrases").select("phrases").eq("day", day).single();
    return json({ day, phrases: data?.phrases ?? phrases });
  } catch (e) {
    console.error(e);
    const status = (e as { status?: number }).status;
    return json({ error: "Couldn't generate today's phrases" }, status === 402 || status === 429 ? status : 500);
  }
});

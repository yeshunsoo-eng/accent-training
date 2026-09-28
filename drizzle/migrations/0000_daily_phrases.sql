CREATE TABLE public.daily_phrases (
  day date PRIMARY KEY,
  phrases jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.daily_phrases TO anon, authenticated;
GRANT ALL ON public.daily_phrases TO service_role;
ALTER TABLE public.daily_phrases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read daily phrases" ON public.daily_phrases FOR SELECT USING (true);
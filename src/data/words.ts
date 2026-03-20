// Words organized by phonetic difficulty for accent training
export const practiceWords = {
  th_sounds: [
    "thought", "through", "three", "thirteen", "thousand", "thick", "thin",
    "thunder", "therapy", "thermal", "thesis", "thread", "throat", "throne",
    "thistle", "thatch", "thaw", "thief", "thigh", "thirst",
    "the", "this", "that", "them", "there", "then", "they", "these", "those", "though",
    "rather", "weather", "feather", "leather", "together", "another", "mother", "father", "brother", "other"
  ],
  r_and_l: [
    "really", "regularly", "relatively", "relentlessly", "reluctantly",
    "literally", "library", "particularly", "regularly", "parallel",
    "rarely", "rural", "referral", "world", "girl", "pearl",
    "correlation", "territorial", "primarily", "peripheral",
    "roller", "ruler", "railroad", "lorry", "rivalry"
  ],
  vowel_sounds: [
    "about", "above", "across", "again", "against", "already",
    "banana", "camera", "chocolate", "comfortable", "comparable",
    "caught", "thought", "bought", "taught", "daughter",
    "bird", "heard", "word", "nurse", "curse",
    "bath", "path", "class", "grass", "last"
  ],
  consonant_clusters: [
    "strengths", "twelfths", "sixths", "months", "lengths",
    "asked", "masked", "risked", "grasped", "clasped",
    "crisps", "wasps", "scripts", "sculpts", "prompts",
    "struggle", "straight", "street", "string", "strong"
  ],
  common_difficult: [
    "comfortable", "vegetable", "temperature", "interesting", "different",
    "wednesday", "february", "library", "secretary", "laboratory",
    "pronunciation", "particularly", "entrepreneurial", "uncharacteristically",
    "schedule", "lieutenant", "aluminium", "advertisement", "controversy"
  ],
};

export const allWords = Object.values(practiceWords).flat();

export function getRandomWord(): string {
  return allWords[Math.floor(Math.random() * allWords.length)];
}

export function getRandomWords(count: number): string[] {
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const listenPhrases = [
  { text: "The weather in London is rather unpredictable throughout the year.", category: "th / weather" },
  { text: "I thought three thousand people would gather together for the festival.", category: "th sounds" },
  { text: "She regularly visits the library to read particularly interesting literature.", category: "r & l sounds" },
  { text: "Would you mind passing the butter? That would be really lovely, thank you.", category: "politeness" },
  { text: "The temperature dropped dramatically, and we weren't comfortable at all.", category: "vowels" },
  { text: "I can't believe how beautiful the countryside looks in February.", category: "silent letters" },
  { text: "He asked whether the schedule had been changed for Wednesday.", category: "mixed difficulty" },
  { text: "The entrepreneur's advertisement caused quite a controversy.", category: "advanced" },
  { text: "My daughter bought a lovely pair of leather boots from the market.", category: "vowels & th" },
  { text: "Rural areas rarely have reliable railway connections, unfortunately.", category: "r sounds" },
  { text: "I'd rather have a bath after walking along that path through the grass.", category: "broad a" },
  { text: "The strengths of the programme are particularly noteworthy this month.", category: "clusters" },
];

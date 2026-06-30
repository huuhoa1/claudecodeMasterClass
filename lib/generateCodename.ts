const adjectives = [
  "Shadow",
  "Phantom",
  "Silent",
  "Golden",
  "Crimson",
  "Iron",
  "Silver",
  "Dark",
  "Swift",
  "Scarlet",
  "Ivory",
  "Obsidian",
  "Emerald",
  "Copper",
  "Neon",
  "Marble",
  "Steel",
  "Velvet",
  "Amber",
  "Azure",
];

const titles = [
  "Fox",
  "Wolf",
  "Hawk",
  "Raven",
  "Cobra",
  "Viper",
  "Ghost",
  "Cipher",
  "Jackal",
  "Lynx",
  "Panther",
  "Falcon",
  "Mole",
  "Oracle",
  "Wraith",
  "Bishop",
  "Knight",
  "Baron",
  "Drake",
  "Sphinx",
];

const nouns = [
  "Strike",
  "Heist",
  "Vault",
  "Echo",
  "Blaze",
  "Surge",
  "Drift",
  "Ridge",
  "Frost",
  "Storm",
  "Blade",
  "Tide",
  "Crest",
  "Pulse",
  "Edge",
  "Flare",
  "Spark",
  "Dawn",
  "Dusk",
  "Cache",
];

function pick(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

export function generateCodename(): string {
  return pick(adjectives) + pick(titles) + pick(nouns);
}

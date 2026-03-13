import speciesData from "@/data/species.json";

export type QuestionType =
  | "image-to-name"
  | "name-to-region"
  | "name-to-status"
  | "name-to-province"
  | "name-to-latin"
  | "funfact-to-name";

export type QuizLevel = "mudah" | "sedang" | "sulit";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: string;
}

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getDistractors = (
  correctAnswer: string,
  allPossibleOptions: string[],
  count: number = 3
) => {
  const filtered = Array.from(new Set(allPossibleOptions)).filter(
    (opt) => opt !== correctAnswer
  );
  return shuffleArray(filtered).slice(0, count);
};

const regionNames: Record<string, string> = {
  sumatera: "Sumatera",
  jawa: "Jawa",
  kalimantan: "Kalimantan",
  sulawesi: "Sulawesi",
  papua: "Papua",
  bali: "Bali",
  nusa_tenggara: "Nusa Tenggara",
  maluku: "Maluku",
};

const statusMap: Record<string, string> = {
  kritis: "Kritis (Critically Endangered)",
  terancam: "Terancam (Endangered)",
  rentan: "Rentan (Vulnerable)",
  punah: "Punah (Extinct)",
  aman: "Berisiko Rendah (Least Concern)",
};

export const generateBankForLevel = (level: QuizLevel): Question[] => {
  const bank: Question[] = [];
  const allNames = speciesData.map((s) => s.name);
  const allLatinNames = speciesData.map((s) => s.latinName);
  const allRegions = Array.from(
    new Set(speciesData.map((s) => regionNames[s.region] || s.region))
  ).filter(Boolean);
  const allProvinces = Array.from(
    new Set(speciesData.map((s) => s.provinceMain))
  ).filter(Boolean);
  const allStatuses = [
    "Kritis (Critically Endangered)",
    "Terancam (Endangered)",
    "Rentan (Vulnerable)",
    "Hampir Terancam (Near Threatened)",
    "Berisiko Rendah (Least Concern)",
  ];

  speciesData.forEach((species, index) => {
    // MUDAH (Easy Level: Image guessing and Regions)
    if (level === "mudah") {
      if (species.image) {
        bank.push({
          id: `m-img-${species.id}-${index}`,
          type: "image-to-name",
          text: `Perhatikan bentuk fisik pada gambar di bawah ini. Tahukah kamu flora/fauna apakah ini?`,
          imageUrl: species.image,
          options: shuffleArray([
            species.name,
            ...getDistractors(species.name, allNames, 3),
          ]),
          correctAnswer: species.name,
        });
      }

      const regionName = regionNames[species.region] || species.region;
      if (regionName) {
        bank.push({
          id: `m-reg-${species.id}-${index}`,
          type: "name-to-region",
          text: `Berdasarkan sebaran utamanya, dari pulau atau kepulauan manakah "${species.name}" aslinya berasal?`,
          options: shuffleArray([
            regionName,
            ...getDistractors(regionName, allRegions, 3),
          ]),
          correctAnswer: regionName,
        });
      }
    }

    // SEDANG (Medium Level: Status and Exact Provinces)
    if (level === "sedang") {
      const mappedStatus = statusMap[species.status];
      const statusName =
        mappedStatus ||
        species.status.charAt(0).toUpperCase() + species.status.slice(1);
      bank.push({
        id: `s-stat-${species.id}-${index}`,
        type: "name-to-status",
        text: `Berdasarkan data IUCN Red List terbaru, apakah status konservasi dari spesies "${species.name}"?`,
        options: shuffleArray([
          statusName,
          ...getDistractors(statusName, allStatuses, 3),
        ]),
        correctAnswer: statusName,
      });

      if (species.provinceMain) {
        bank.push({
          id: `s-prov-${species.id}-${index}`,
          type: "name-to-province",
          text: `Di provinsi manakah populasi paling dominan dari "${species.name}" dapat ditemukan?`,
          options: shuffleArray([
            species.provinceMain,
            ...getDistractors(species.provinceMain, allProvinces, 3),
          ]),
          correctAnswer: species.provinceMain,
        });
      }
    }

    // SULIT (Hard Level: Latin Names and Obfuscated Fun Facts)
    if (level === "sulit") {
      if (species.latinName) {
        bank.push({
          id: `h-lat-${species.id}-${index}`,
          type: "name-to-latin",
          text: `Apa sebutan nama ilmiah (latin) yang tepat dan sah untuk spesies "${species.name}"?`,
          options: shuffleArray([
            species.latinName,
            ...getDistractors(species.latinName, allLatinNames, 3),
          ]),
          correctAnswer: species.latinName,
        });
      }

      if (species.funFact) {
        let factText = species.funFact;
        // Obfuscate the species name in the fact if it exists to avoid giving away the answer
        const wordsToHide = species.name.split(" ");
        wordsToHide.forEach((word) => {
          if (word.length > 2) {
            const regex = new RegExp(word, "gi");
            factText = factText.replace(regex, "___");
          }
        });

        bank.push({
          id: `h-fact-${species.id}-${index}`,
          type: "funfact-to-name",
          text: `Fakta Menarik: "${factText}"\n\nDari penjelasan unik di atas, flora/fauna apakah yang sebenarnya dimaksud?`,
          options: shuffleArray([
            species.name,
            ...getDistractors(species.name, allNames, 3),
          ]),
          correctAnswer: species.name,
        });
      }
    }
  });

  // Extract exactly 30 unique and shuffled questions for the bank
  return shuffleArray(bank).slice(0, 30);
};

export const getRandomQuizSession = (
  level: QuizLevel,
  count: number = 10
): Question[] => {
  const bank = generateBankForLevel(level);
  // Re-shuffle and take 10 from the generated 30-bank
  return shuffleArray(bank).slice(0, count);
};

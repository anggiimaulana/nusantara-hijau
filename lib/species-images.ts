const SPECIES_IMAGE_FALLBACK = "/images/species/harimau-sumatera.jpg";

const AVAILABLE_SPECIES_IMAGES = new Set<string>([
  "/images/species/anoa.jpg",
  "/images/species/babirusa.jpg",
  "/images/species/badak-jawa.jpg",
  "/images/species/bekantan.jpg",
  "/images/species/cenderawasih.jpg",
  "/images/species/elang-jawa.jpg",
  "/images/species/harimau-sumatera.jpg",
  "/images/species/jalak-bali.jpg",
  "/images/species/kanguru-pohon.jpg",
  "/images/species/kantong-semar.jpg",
  "/images/species/kasuari.jpg",
  "/images/species/komodo.jpg",
  "/images/species/lutung-jawa.jpg",
  "/images/species/maleo.jpg",
  "/images/species/orangutan-sumatera.jpg",
  "/images/species/rafflesia-arnoldii.jpg",
  "/images/species/rusa-timor.jpg",
]);

export function resolveSpeciesImage(imagePath?: string | null): string {
  if (!imagePath) return SPECIES_IMAGE_FALLBACK;
  return AVAILABLE_SPECIES_IMAGES.has(imagePath) ? imagePath : SPECIES_IMAGE_FALLBACK;
}


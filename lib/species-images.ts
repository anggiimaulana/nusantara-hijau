/**
 * Resolves a species image path, falling back to harimau-sumatera if the
 * image file doesn't exist on disk.
 *
 * Auto-generated from /public/images/species — all 58 available files.
 */

const SPECIES_IMAGE_FALLBACK = "/images/species/harimau-sumatera.jpg";

const AVAILABLE_SPECIES_IMAGES = new Set<string>([
  "/images/species/anoa.jpg",
  "/images/species/ayam-hutan-bulwer.jpg",
  "/images/species/babirusa.jpg",
  "/images/species/badak-jawa.jpg",
  "/images/species/badak-sumatera.jpg",
  "/images/species/banteng-jawa.jpg",
  "/images/species/bekantan.jpg",
  "/images/species/beruang-madu.jpg",
  "/images/species/bunga-bangkai.jpg",
  "/images/species/burung-poksai-jawa.jpg",
  "/images/species/burung-tanah-sulawesi.jpg",
  "/images/species/cenderawasih.jpg",
  "/images/species/ciung-wanara.jpg",
  "/images/species/elang-jawa.jpg",
  "/images/species/enggang-badak.jpg",
  "/images/species/enggang-helm.jpg",
  "/images/species/enggang-knob.jpg",
  "/images/species/gajah-sumatera.jpg",
  "/images/species/harimau-sumatera.jpg",
  "/images/species/jalak-bali.jpg",
  "/images/species/kancil-jawa.jpg",
  "/images/species/kanguru-pohon.jpg",
  "/images/species/kantong-semar.jpg",
  "/images/species/kasuari.jpg",
  "/images/species/komodo.jpg",
  "/images/species/kucing-bayan.jpg",
  "/images/species/kucing-hutan-kalimantan.jpg",
  "/images/species/kucing-marmar.jpg",
  "/images/species/kukang-jawa.jpg",
  "/images/species/kukang-sumatera.jpg",
  "/images/species/kuskus-beruang.jpg",
  "/images/species/lutung-jawa.jpg",
  "/images/species/lutung-mentawai.jpg",
  "/images/species/macan-dahan-sumatera.jpg",
  "/images/species/macan-tutul-jawa.jpg",
  "/images/species/maleo.jpg",
  "/images/species/merak-hijau.jpg",
  "/images/species/merak-phengop.jpg",
  "/images/species/monyet-moor.jpg",
  "/images/species/monyet-tonkean.jpg",
  "/images/species/musang-sulawesi.jpg",
  "/images/species/orangutan-kalimantan.jpg",
  "/images/species/orangutan-sumatera.jpg",
  "/images/species/owa-berang-beran.jpg",
  "/images/species/owa-jawa.jpg",
  "/images/species/owa-muller.jpg",
  "/images/species/pohon-ulin.jpg",
  "/images/species/rafflesia-arnoldii.jpg",
  "/images/species/rusa-timor.jpg",
  "/images/species/siamang.jpg",
  "/images/species/singapuar.jpg",
  "/images/species/tapir-asia.jpg",
  "/images/species/tarsius.jpg",
  "/images/species/trenggiling-jawa.jpg",
  "/images/species/trenggiling-sunda.jpg",
  "/images/species/tupai-terbang-sumatera.jpg",
  "/images/species/yaki.jpg",
]);

export function hasSpeciesImage(imagePath?: string | null): boolean {
  return Boolean(imagePath && AVAILABLE_SPECIES_IMAGES.has(imagePath));
}

export function resolveSpeciesImage(imagePath?: string | null): string {
  if (!imagePath) return SPECIES_IMAGE_FALLBACK;
  return AVAILABLE_SPECIES_IMAGES.has(imagePath) ? imagePath : SPECIES_IMAGE_FALLBACK;
}

import { MONOGRAM_SIZE, monogramIcon } from "@/components/brand/monogram";

// The declared icon (<link rel="icon">), generated at build time.
export const size = MONOGRAM_SIZE;
export const contentType = "image/png";

export default function Icon() {
  return monogramIcon();
}

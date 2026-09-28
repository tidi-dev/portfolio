// en-US grouping (ruling: numbers use Intl.NumberFormat, e.g. 2,951).
const EN_US = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return EN_US.format(value);
}

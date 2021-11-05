function titleize(value:string) {
  return value.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase())
}

export function normalizeString(value:string) {
  return titleize(value.trim());
}

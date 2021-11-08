/**
 * titleize makes the first letter of every word uppercase and the rest lowercase.
 * i.e.:
 * titleize("jAnE dOe") => "Jane Doe"
 * titleize("jane doe") => "Jane Doe"
 */
function titleize(value: string) {
  return value.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase())
}

export function normalizeString(value:string) {
  return titleize(value.trim());
}

export type Option = { value: number; label: string };

const BASE = "http://localhost:5000/api/Lookups";

type RawOption = { value: number; name: string };
const prettify = (s: string) => s.replace(/([A-Z])/g, " $1").trim();

async function fetchOptions(path: string): Promise<Option[]> {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const data: RawOption[] = await res.json();
  return data.map((x) => ({ value: x.value, label: prettify(x.name) }));
}

export async function getBloodTypes() {
  return fetchOptions("blood-types");
}

export async function getAcademicLevels() {
  return fetchOptions("academic-levels");
}

export async function getAddressTypes() {
  return fetchOptions("address-types");
}

export async function getGenders() {
  return fetchOptions("genders");
}

export async function getParentTypes() {
  return fetchOptions("parent-types");
}

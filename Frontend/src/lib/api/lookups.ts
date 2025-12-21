import {
  FacultyType,
  facultyTypeMap,
} from "../types/student-types";
export type Option = { value: number | string; label: string };

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const BASE = `${API_BASE_URL}/api/Lookups`;

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

export async function getFacultyTypes(): Promise<Option[]> {
  const options = Object.keys(FacultyType)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => {
      const numericKey = Number(key);
      return {
        value: numericKey,
        label: facultyTypeMap[numericKey],
      };
    });
  return Promise.resolve(options);
}

export async function getProvinces(): Promise<Option[]> {
  const res = await fetch(`${BASE}/provinces`);
  if (!res.ok) throw new Error(`Failed to fetch provinces`);
  const data: string[] = await res.json();
  return data.map((p) => ({ value: p, label: p }));
}

export async function getMunicipalities(province: string): Promise<Option[]> {
  const res = await fetch(`${BASE}/districts/${province}`);
  if (!res.ok)
    throw new Error(`Failed to fetch districts for ${province}`);
  const data: string[] = await res.json();
  return data.map((m) => ({ value: m, label: m }));
}
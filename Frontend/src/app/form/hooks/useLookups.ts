import { useState, useEffect } from "react";
import {
  getBloodTypes,
  getAcademicLevels,
  getGenders,
  getParentTypes,
  getFacultyTypes,
  getProvinces,
  getMunicipalities,
  Option,
} from "@/lib/api/lookups";

export interface LookupOptions {
  bloodTypeOptions: Option[];
  academicLevelOptions: Option[];
  genderOptions: Option[];
  parentTypeOptions: Option[];
  facultyTypeOptions: Option[];
  provinceOptions: Option[];
  permanentMunicipalities: Option[];
  temporaryMunicipalities: Option[];
}

export const useLookups = (
  permanentProvince?: string,
  temporaryProvince?: string
) => {
  const [bloodTypeOptions, setBloodTypeOptions] = useState<Option[]>([]);
  const [academicLevelOptions, setAcademicLevelOptions] = useState<Option[]>(
    []
  );
  const [genderOptions, setGenderOptions] = useState<Option[]>([]);
  const [parentTypeOptions, setParentTypeOptions] = useState<Option[]>([]);
  const [facultyTypeOptions, setFacultyTypeOptions] = useState<Option[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<Option[]>([]);
  const [permanentMunicipalities, setPermanentMunicipalities] = useState<
    Option[]
  >([]);
  const [temporaryMunicipalities, setTemporaryMunicipalities] = useState<
    Option[]
  >([]);
  const [lookupsLoaded, setLookupsLoaded] = useState(false);

  // Load initial lookups
  useEffect(() => {
    (async () => {
      try {
        const [bt, al, g, pt, ft, prov] = await Promise.all([
          getBloodTypes(),
          getAcademicLevels(),
          getGenders(),
          getParentTypes(),
          getFacultyTypes(),
          getProvinces(),
        ]);
        setBloodTypeOptions(bt);
        setAcademicLevelOptions(al);
        setGenderOptions(g);
        setParentTypeOptions(pt);
        setFacultyTypeOptions(ft);
        setProvinceOptions(prov);
        setLookupsLoaded(true);
      } catch (e) {
        console.error("Failed to load lookups", e);
      }
    })();
  }, []);

  // Load municipalities when province changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!permanentProvince) {
        queueMicrotask(() => {
          if (!cancelled) setPermanentMunicipalities([]);
        });
        return;
      }

      const data = await getMunicipalities(permanentProvince);
      if (!cancelled) setPermanentMunicipalities(data);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [permanentProvince]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!temporaryProvince) {
        queueMicrotask(() => {
          if (!cancelled) setTemporaryMunicipalities([]);
        });
        return;
      }

      const data = await getMunicipalities(temporaryProvince);
      if (!cancelled) setTemporaryMunicipalities(data);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [temporaryProvince]);

  return {
    bloodTypeOptions,
    academicLevelOptions,
    genderOptions,
    parentTypeOptions,
    facultyTypeOptions,
    provinceOptions,
    permanentMunicipalities,
    temporaryMunicipalities,
    setPermanentMunicipalities,
    setTemporaryMunicipalities,
    lookupsLoaded,
  };
};

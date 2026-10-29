"use client";

import { useEffect, useState } from "react";
import { ComboboxField, type ComboboxOption } from "gui-mellow/Combobox";
import { Example } from "../lib/Example";

const regions: ComboboxOption[] = [
  { value: "fra", label: "Frankfurt", description: "eu-central" },
  { value: "lon", label: "London", description: "eu-west" },
  { value: "sea", label: "Seattle", description: "us-west" },
  { value: "stl", label: "St. Louis", description: "us-central" },
  { value: "syd", label: "Sydney", description: "ap-southeast", disabled: true },
];

const projects = ["acme/shop", "acme/notes", "acme/platform/api", "acme/platform/web", "tools/ci-images"];

/** A pretend search, as a server would answer it. */
function useSearch(text: string) {
  const [found, setFound] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setFound(projects.filter((path) => path.includes(text.toLowerCase())).map((path) => ({ value: path, label: path })));
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [text]);
  return { found, loading };
}

export default function ComboboxDemo() {
  const [region, setRegion] = useState("sea");
  const [chosenRegions, setRegions] = useState(["fra", "lon"]);
  const [project, setProject] = useState("");
  const [search, setSearch] = useState("");
  const { found, loading } = useSearch(search);

  return (
    <>
      <Example title="Filtered as you type" description="Arrow keys move, Enter chooses, Escape closes.">
        <ComboboxField label="Region" options={regions} value={region} onChange={setRegion} hint={`Chosen: ${region}`} />
      </Example>
      <Example
        title="Several at once"
        description="With multiple: choosing again unchooses, and Backspace removes the last."
      >
        <ComboboxField
          multiple
          label="Regions"
          placeholder="Add a region"
          options={regions}
          value={chosenRegions}
          onChange={setRegions}
          hint={`Chosen: ${chosenRegions.join(", ") || "none"}`}
        />
      </Example>
      <Example title="Searched elsewhere" description="Matches fetched as the text changes, with filter={false}.">
        <ComboboxField
          label="Project"
          placeholder="Search projects"
          options={found}
          filter={false}
          loading={loading}
          value={project}
          onChange={setProject}
          onInputChange={setSearch}
          emptyMessage="No project matches."
        />
      </Example>
    </>
  );
}

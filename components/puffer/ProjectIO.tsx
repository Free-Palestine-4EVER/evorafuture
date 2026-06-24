"use client";

import { useStudio } from "@/lib/puffer/store";
import { ProjectFile } from "@/lib/puffer/store";

export default function ProjectIO() {
  const { planImage, serializeProject, loadProject } = useStudio();

  function save() {
    const data = JSON.stringify(serializeProject());
    const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "puffer-project.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function open(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = JSON.parse(reader.result as string) as ProjectFile;
        if (!p || typeof p !== "object" || !("rects" in p)) throw new Error("not a Puffer project");
        loadProject(p);
      } catch {
        alert("That doesn't look like a Puffer project file (.json).");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={save}
        disabled={!planImage}
        title="Save this project to a file"
        className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
          planImage ? "bg-neutral-700 text-white hover:bg-neutral-600" : "cursor-not-allowed bg-neutral-800 text-neutral-500"
        }`}
      >
        Save
      </button>
      <label className="cursor-pointer rounded-md bg-neutral-700 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-neutral-600" title="Open a saved project file">
        Open
        <input type="file" accept="application/json,.json" className="hidden" onChange={open} />
      </label>
    </div>
  );
}

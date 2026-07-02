"use client";

import { toast } from "@/lib/homestudio/toast";

import { useStudio } from "@/lib/homestudio/store";
import { ProjectFile } from "@/lib/homestudio/store";

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
    toast.success("Project saved — puffer-project.json");
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
        toast.success("Project opened");
      } catch {
        toast.error("That doesn't look like a Puffer project file (.json).");
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
          planImage ? "bg-raised border border-line text-ink hover:bg-clay-50" : "cursor-not-allowed bg-raised border border-line text-faint"
        }`}
      >
        Save
      </button>
      <label className="cursor-pointer rounded-md bg-raised border border-line px-2.5 py-1.5 text-sm font-medium text-ink hover:bg-clay-50" title="Open a saved project file">
        Open
        <input type="file" accept="application/json,.json" className="hidden" onChange={open} />
      </label>
    </div>
  );
}

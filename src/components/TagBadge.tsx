import { Tag } from "@/data/workflow";

const TAG_STYLES: Record<Tag["color"], string> = {
  slack: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  restream: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  ls6: "bg-cyan-500/15 text-cyan-500 border-cyan-500/20",
  camera: "bg-red-500/15 text-red-500 border-red-500/20",
  audio: "bg-green-500/15 text-green-600 border-green-500/20",
  graphics: "bg-indigo-500/15 text-indigo-500 border-indigo-500/20",
  time: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  thu: "bg-violet-500/15 text-violet-500 border-violet-500/20",
};

export function TagBadge({ tag }: { tag: Tag }) {
  return (
    <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${TAG_STYLES[tag.color]}`}>
      {tag.label}
    </span>
  );
}

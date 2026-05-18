import { Activity } from "lucide-react";

export default function ApiStatusBadge({ active = true, label = "Auto Rotate Active" }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " +
        (active
          ? "bg-[rgba(34,197,94,0.1)] text-rmok border border-[rgba(34,197,94,0.35)]"
          : "bg-[rgba(255,77,77,0.1)] text-rmerror border border-[rgba(255,77,77,0.35)]")
      }
    >
      <Activity size={12} />
      {label}
    </span>
  );
}

import { Button } from "@/components/ui/button";

type Status = "pending" | "approved" | "rejected";

type Props = {
  normalized_name: string;
  display_name: string;
  total: number;
  variations?: string[];
  status: Status;
  reviewed_by_name?: string | null;

  onApprove?: () => void;
  onReject?: () => void;
};

export function SoftSkillRequestCard({
  display_name,
  total,
  variations,
  status,
  reviewed_by_name,
  onApprove,
  onReject,
}: Props) {
  const getCardStyle = () => {
    switch (status) {
      case "pending":
        return "border-orange-500/20 bg-orange-500/5";

      case "approved":
        return "border-green-500/20 bg-green-500/5";

      case "rejected":
        return "border-red-500/20 bg-red-500/5";
    }
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all hover:border-white/20 ${getCardStyle()}`}
    >
      <h2 className="text-white text-xl font-bold">{display_name}</h2>

      <p className="text-slate-300 mt-2 text-sm">{total} solicitudes similares</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(variations || []).map((v) => (
          <span key={v} className="text-xs px-2 py-1 rounded bg-black/20 text-slate-300">
            {v}
          </span>
        ))}
      </div>
      {reviewed_by_name && (
        <p className="text-xs text-slate-400 mt-4">Revisado por: {reviewed_by_name}</p>
      )}

      {status === "pending" && (
        <div className="flex gap-3 mt-5">
          <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={onApprove}>
            Aprobar
          </Button>

          <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={onReject}>
            Rechazar
          </Button>
        </div>
      )}
    </div>
  );
}

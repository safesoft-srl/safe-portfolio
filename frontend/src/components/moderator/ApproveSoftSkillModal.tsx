import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  skillName: string;
  loading?: boolean;

  onClose: () => void;
  onConfirm: () => void;
};

export function ApproveSoftSkillModal({
  isOpen,
  skillName,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-[420px] rounded-2xl border border-[#2a2f55] bg-[#1b1f3a] p-6">
        <h2 className="text-white text-xl font-bold">Aprobar habilidad</h2>
        <p className="text-slate-300 mt-3 text-sm leading-relaxed">
          Se aprobarán todas las solicitudes relacionadas con:
        </p>

        <div className="mt-4 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3">
          <span className="text-green-300 font-semibold">{skillName}</span>
        </div>

        <p className="text-slate-400 text-sm mt-4">
          Esto marcará automáticamente todas las variaciones similares como aprobadas.
        </p>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={onConfirm}
            disabled={loading}
          >
            Aprobar
          </Button>
        </div>
      </div>
    </div>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmLabel = "Eliminar",
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-sidebar-border dark:border-[#2a2d46] bg-white dark:bg-[#151a3f] text-slate-900 dark:text-slate-100">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-sidebar-border text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-[#2a2d46] dark:text-slate-300 dark:hover:bg-[#1c1f38] dark:hover:text-slate-200">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction className="bg-[#e53e3e] text-white hover:bg-[#c53030]" onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

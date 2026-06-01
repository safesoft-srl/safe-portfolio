import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserMinus } from "@phosphor-icons/react";
import { useDeleteModerator } from "../hooks/useModerators";
import { toast } from "sonner";
import axios from "axios";
import type { User } from "@/types/users";

interface Props {
  moderator: User;
}

export default function DeleteModeratorDialog({ moderator }: Props) {
  const deleteModerator = useDeleteModerator();

  const handleDelete = async () => {
    try {
      await deleteModerator.mutateAsync(moderator.id!);
      toast.success(`Rol de moderador removido a '${moderator.name}' correctamente`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al degradar al usuario");
      }
    }
  };

  return (
    <AlertDialog>
      {/* @ts-expect-error asChild type issue with React 19 / Shadcn */}
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-destructive hover:text-destructive"
        >
          <UserMinus size={16} weight="bold" />
          Remover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Remover rol de moderador?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de quitarle los privilegios a <strong>{moderator.name}</strong> (
            {moderator.email}). Su cuenta volverá a ser un usuario normal y mantendrá sus
            portafolios intactos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleteModerator.isPending ? "Removiendo..." : "Sí, remover rol"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

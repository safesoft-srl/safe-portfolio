import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldPlus } from "@phosphor-icons/react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateModerator } from "../hooks/useModerators";
import { toast } from "sonner";
import axios from "axios";

const schema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Debe ser un correo válido"),
  permissions: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateModeratorDialog() {
  const [open, setOpen] = useState(false);
  const createModerator = useCreateModerator();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", permissions: [] },
  });

  const selectedPermissions = useWatch({ control, name: "permissions" }) || [];

  const handlePermissionChange = (perm: string, checked: boolean) => {
    if (checked) {
      setValue("permissions", [...selectedPermissions, perm]);
    } else {
      setValue(
        "permissions",
        selectedPermissions.filter((p) => p !== perm)
      );
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createModerator.mutateAsync({
        ...data,
        permissions: data.permissions || [],
      });
      toast.success("Usuario ascendido a moderador correctamente");
      reset();
      setOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors).flat()[0];
        toast.error(firstError as string);
      } else {
        toast.error("Error al ascender el moderador");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      {/* @ts-expect-error asChild type issue with React 19 / Shadcn */}
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ShieldPlus size={18} weight="bold" />
          Ascender a Moderador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle>Ascender a moderador</DialogTitle>
          <DialogDescription>
            Busca un usuario existente por su correo y otórgale permisos de administrador.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico del usuario</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej: usuario@correo.com"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-3 pt-2">
            <Label>Permisos base (opcional)</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perm_mods"
                checked={selectedPermissions.includes("manage_moderators")}
                onCheckedChange={(c) => handlePermissionChange("manage_moderators", c === true)}
              />
              <Label htmlFor="perm_mods" className="font-normal cursor-pointer">
                Gestionar Moderadores
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perm_cats"
                checked={selectedPermissions.includes("manage_catalogs")}
                onCheckedChange={(c) => handlePermissionChange("manage_catalogs", c === true)}
              />
              <Label htmlFor="perm_cats" className="font-normal cursor-pointer">
                Gestionar Catálogos y Habilidades
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perm_reps"
                checked={selectedPermissions.includes("view_reports")}
                onCheckedChange={(c) => handlePermissionChange("view_reports", c === true)}
              />
              <Label htmlFor="perm_reps" className="font-normal cursor-pointer">
                Generar y ver Reportes
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || createModerator.isPending}>
              {createModerator.isPending ? "Guardando..." : "Ascender"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

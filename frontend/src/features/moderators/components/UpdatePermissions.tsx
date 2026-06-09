import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";

import type { User } from "@/types/users";

import { useUpdateModeratorPermissions } from "../hooks/useModerators";

const schema = z.object({
  permissions: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  user: User;
};

const PERMISSIONS = [
  {
    key: "manage_moderators",
    label: "Gestionar Moderadores",
  },
  {
    key: "manage_catalogs_technicals",
    label: "Gestionar Catálogos de Habilidades Técnicas",
  },
  {
    key: "manage_catalogs_softskills",
    label: "Gestionar Catálogos de Habilidades Blandas",
  },
  {
    key: "view_reports",
    label: "Generar y ver Reportes",
  },
  {
    key: "manage_portfolios",
    label: "Gestionar Portafolios",
  },
];

export default function UpdatePermissions({ user }: Props) {
  const [open, setOpen] = useState(false);

  const updatePermissions = useUpdateModeratorPermissions();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      permissions: [],
    },
  });

  const selectedPermissions =
    useWatch({
      control,
      name: "permissions",
    }) || [];

  useEffect(() => {
    if (open) {
      reset({
        permissions: user.permissions ?? [],
      });
    }
  }, [open, user, reset]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setValue("permissions", [...selectedPermissions, permission]);
    } else {
      setValue(
        "permissions",
        selectedPermissions.filter((p) => p !== permission)
      );
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await updatePermissions.mutateAsync({
        id: Number(user.id),
        permissions: data.permissions ?? [],
        email: user.email ?? "",
      });

      toast.success("Permisos actualizados correctamente");
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors).flat()[0];

        toast.error(firstError as string);
      } else {
        toast.error("Error al actualizar los permisos");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          reset({
            permissions: user.permissions ?? [],
          });
        }
      }}
    >
      <DialogTrigger>
        <Button
          variant="outline"
          size="sm"
          className="border-[#6c72ff] text-slate-300 hover:bg-[#2a2f55]/50 hover:border-[#5a60e6]"
        >
          Editar Permisos
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#14172b] border-[#2a2f55] text-white">
        <DialogHeader>
          <DialogTitle>Gestionar Permisos</DialogTitle>

          <DialogDescription>Usuario: {user.email}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-3">
            <Label>Permisos asignados</Label>

            {PERMISSIONS.map((permission) => (
              <div key={permission.key} className="flex items-center space-x-2">
                <Checkbox
                  id={permission.key}
                  checked={selectedPermissions.includes(permission.key)}
                  onCheckedChange={(checked) =>
                    handlePermissionChange(permission.key, checked === true)
                  }
                />

                <Label htmlFor={permission.key} className="font-normal cursor-pointer">
                  {permission.label}
                </Label>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting || updatePermissions.isPending}>
              {updatePermissions.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

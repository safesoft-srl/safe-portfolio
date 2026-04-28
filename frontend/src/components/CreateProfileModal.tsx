import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X, PlusIcon } from "@phosphor-icons/react";
import { AxiosError } from "axios";
import ProfileForm, { type ProfileFormData } from "@/components/ProfileForm";
import { getProfile, updateProfile, createProfile } from "@/services/profile.service";
import { toast } from "sonner";

import defaultProfileImage from "@/assets/image.png";

const EMPTY_PROFILE: ProfileFormData = {
  profile_name: "",
  profile_email: "",
  profession: "",
  bio: "",
  url_photo: defaultProfileImage,
  url_portfolio: "",
};

export default function CreateProfileModal({ onCreated }: { onCreated?: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: ProfileFormData, file: File | null) => {
    setIsSaving(true);
    try {
      // obtener el perfil
      let exists = true;
      try {
        await getProfile();
      } catch (e: unknown) {
        const axiosError = e as AxiosError;
        if (axiosError.response?.status === 404) {
          exists = false;
        } else {
          throw e;
        }
      }
      //  Crear o actualizar según corresponda
      if (exists) {
        await updateProfile({ ...data, profile_image: null }, file);
      } else {
        await createProfile({ ...data, profile_image: null }, file);
      }

      toast.success("Perfil guardado correctamente", {
        style: {
          background: "#6c72ff",
          color: "#ffffff",
          border: "1px solid #8b90ff",
        },
      });
      setOpen(false);
      if (onCreated) onCreated();
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar el perfil");
    }
    setIsSaving(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="default" size="lg" className="px-5 font-heading flex items-center gap-2">
          <PlusIcon weight="bold" /> Crear un nuevo portafolio
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl bg-slate-900">
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 20,
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          <X size={20} weight="bold" color="#8c91b7" />
        </button>
        <AlertDialogHeader />
        <ProfileForm
          mode="create"
          initialData={EMPTY_PROFILE}
          onSubmit={handleSubmit}
          isSaving={isSaving}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

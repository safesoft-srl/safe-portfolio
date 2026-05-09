import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X, PlusIcon } from "@phosphor-icons/react";
import ProfileForm, { type ProfileFormData } from "@/components/ProfileForm";
import { createProfile } from "@/services/profile.service";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";

import defaultProfileImage from "@/assets/image.png";
import type { ProfileData } from "@/services/profile.service";

export default function CreateProfileModal({
  onCreated,
  open: controlledOpen,
  onOpenChange,
  hideTrigger,
}: {
  onCreated?: (profile?: ProfileData) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const user = useAuthStore((state) => state.user);
  console.log("user:", user);
  const [isSaving, setIsSaving] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (v: boolean) => {
    if (isControlled) {
      onOpenChange?.(v);
    } else {
      setInternalOpen(v);
    }
  };

  const EMPTY_PROFILE: ProfileFormData = {
    profile_name: user?.name || "",
    profile_email: user?.email || "",
    profession: "",
    bio: "",
    profile_image: defaultProfileImage,
    url_portfolio: "",
  };

  const handleSubmit = async (data: ProfileFormData, file: File | null) => {
    setIsSaving(true);
    try {
      const created = await createProfile(data, file);
      toast.success("Portafolio creado correctamente", {
        style: {
          background: "#6c72ff",
          color: "#ffffff",
          border: "1px solid #8b90ff",
        },
      });
      setOpen(false);
      if (onCreated) onCreated(created ?? undefined);
    } catch (e) {
      console.error(e);
      toast.error("Error al crear el portafolio");
    }
    setIsSaving(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <AlertDialogTrigger>
          <Button variant="default" size="lg" className="px-5 font-heading flex items-center gap-2">
            <PlusIcon weight="bold" /> Crear un nuevo portafolio
          </Button>
        </AlertDialogTrigger>
      )}
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
          idPortfolio={0}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

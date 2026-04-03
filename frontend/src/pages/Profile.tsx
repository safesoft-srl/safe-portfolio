import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getProfile,
  updateProfile,
} from "@/services/profile.service";
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

const DEFAULT_PROFILE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <rect width='200' height='200' rx='100' fill='#21264f'/>
    <circle cx='100' cy='78' r='34' fill='#d8ddff'/>
    <path d='M40 162c10-28 34-42 60-42s50 14 60 42' fill='#d8ddff'/>
  </svg>`
)}`;

const VALID_TEXT_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,;:()'"\-\n\r]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ProfileField = "fullName" | "email" | "profession" | "bio";

const EMPTY_ERRORS: Record<ProfileField, string> = {
  fullName: "",
  email: "",
  profession: "",
  bio: "",
};

export default function Profile() {
  const [showPhotoActions, setShowPhotoActions] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_IMAGE);
  const hasCustomPhoto = profileImage !== DEFAULT_PROFILE_IMAGE;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoActionsRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    profile_name: "",
    profile_email: "",
    profession: "",
    bio: "",
    url_portfolio: "",
  });
  const [initialFormData, setInitialFormData] = useState({
    profile_name: "",
    profile_email: "",
    profession: "",
    bio: "",
    url_portfolio: "",
  });
  const [errors, setErrors] = useState<Record<ProfileField, string>>(EMPTY_ERRORS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateField = (field: ProfileField, value: string) => {
    const trimmedValue = value.trim();

    if (field === "fullName") {
      if (!trimmedValue) return "El nombre es obligatorio.";
      if (trimmedValue.length < 2 || trimmedValue.length > 30) {
        return "El nombre debe tener entre 2 y 30 caracteres.";
      }
      if (!VALID_TEXT_REGEX.test(trimmedValue)) {
        return "El nombre contiene caracteres inválidos.";
      }
      return "";
    }

    if (field === "email") {
      if (!trimmedValue) return "El correo electrónico es obligatorio.";
      if (!EMAIL_REGEX.test(trimmedValue)) {
        return "El correo electrónico no tiene un formato válido.";
      }
      return "";
    }

    if (field === "profession") {
      if (trimmedValue.length < 5) {
        return "La profesión debe tener al menos 5 caracteres.";
      }
      if (!VALID_TEXT_REGEX.test(trimmedValue)) {
        return "La profesión contiene caracteres inválidos.";
      }
      return "";
    }

    if (trimmedValue.length < 100) {
      return "La biografía debe tener al menos 100 caracteres.";
    }
    if (!VALID_TEXT_REGEX.test(trimmedValue)) {
      return "La biografía contiene caracteres inválidos.";
    }
    return "";
  };

  const getFieldKey = (name: string): ProfileField => {
    if (name === "profile_name" || name === "fullName") return "fullName";
    if (name === "profile_email" || name === "email") return "email";
    if (name === "profession") return "profession";
    return "bio";
  };

  const getStateKey = (field: ProfileField) => {
    if (field === "fullName") return "profile_name";
    if (field === "email") return "profile_email";
    return field;
  };

  const hasUnsavedChanges =
    formData.profile_name !== initialFormData.profile_name ||
    formData.profile_email !== initialFormData.profile_email ||
    formData.profession !== initialFormData.profession ||
    formData.bio !== initialFormData.bio || 
    selectedFile !== null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const field = getFieldKey(name);
    const stateKey = getStateKey(field);

    setFormData((prev) => ({
      ...prev,
      [stateKey]: value,
    }));

    if (field in errors) {
      if (errors[field]) {
        const message = validateField(field, value);
        setErrors((prev) => ({
          ...prev,
          [field]: message,
        }));
      }
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = getFieldKey(e.target.name);
    const message = validateField(field, e.target.value);
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  const handleSave = async () => {
    const nextErrors: Record<ProfileField, string> = {
      fullName: validateField("fullName", formData.profile_name),
      email: validateField("email", formData.profile_email),
      profession: validateField("profession", formData.profession),
      bio: validateField("bio", formData.bio),
    };

    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    const payload = {
      profile_name: formData.profile_name.trim(),
      profile_email: formData.profile_email.trim(),
      profession: formData.profession.trim(),
      bio: formData.bio.trim(),
      profile_image: null,
      url_portfolio: formData.url_portfolio.trim(),
    };

    try {
      const profile = await updateProfile(payload, selectedFile);
      const nextData = {
        profile_name: profile.profile_name,
        profile_email: profile.profile_email,
        profession: profile.profession,
        bio: profile.bio,
        url_portfolio: profile.url_portfolio,
      };

      setSelectedFile(null);

      setInitialFormData(nextData);
      setFormData({
        profile_name: profile.profile_name,
        profile_email: profile.profile_email,
        profession: profile.profession,
        bio: profile.bio,
        url_portfolio: profile.url_portfolio,
      });

      if (profile.profile_image) {
        setProfileImage(profile.profile_image);
      }
    } catch( error) {
      setFormData({
        profile_name: payload.profile_name,
        profile_email: payload.profile_email,
        profession: payload.profession,
        bio: payload.bio,
        url_portfolio: payload.url_portfolio,
      });
      console.error("Error updating profile:", error);
    }

    setErrors(EMPTY_ERRORS);
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setProfileImage(URL.createObjectURL(file));
    setShowPhotoActions(false);

  };

  const handleRemovePhoto = async () => {
    setProfileImage(DEFAULT_PROFILE_IMAGE);
    setShowPhotoActions(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        if (!isMounted) return;

        setFormData({
          profile_name: profile.profile_name,
          profile_email: profile.profile_email,
          profession: profile.profession,
          bio: profile.bio,
          url_portfolio: profile.url_portfolio,
        });
        setInitialFormData({
          profile_name: profile.profile_name,
          profile_email: profile.profile_email,
          profession: profile.profession,
          bio: profile.bio,
          url_portfolio: profile.url_portfolio,
        });
        
        setProfileImage(profile.profile_image ?? DEFAULT_PROFILE_IMAGE);
        console.log("Loaded profile:", profile);
      } catch {
        // local.
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showPhotoActions) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const clickedInsideAlertDialog = Boolean(target.closest('[data-slot="alert-dialog-content"]'));
      if (clickedInsideAlertDialog) return;

      if (photoActionsRef.current && !photoActionsRef.current.contains(target)) {
        setShowPhotoActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showPhotoActions]);

  return (
    <div className="mx-auto w-full max-w-5xl font-sans text-white">
      <h1 className="mb-4 text-3xl font-semibold">Mi Perfil</h1>

      <section className="w-full rounded-2xl bg-[#13152e] px-7 py-8">
        <h2 className="mb-8 text-2xl font-semibold">Información Básica</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
        <div className="space-y-5">
          <Label className="text-xs font-semibold text-slate-300">Foto de Perfil</Label>

          <div ref={photoActionsRef} className="relative mx-auto -mt-8 w-fit">
            <Avatar className="h-60 w-60">
              <AvatarImage src={profileImage} alt="Foto de perfil" />
              <AvatarFallback className="bg-[#21264f] text-[6.5rem] font-semibold text-white">👤</AvatarFallback>
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => setShowPhotoActions((prev) => !prev)}
              className="absolute bottom-2 left-2 inline-flex h-7 items-center gap-1 rounded-md border border-[#6d79ff]/70 bg-[#5562ed] px-2 text-xs font-medium text-white hover:bg-[#4d59da]"
            >
              <span aria-hidden="true" className="text-xs leading-none">✎</span>
              Editar
            </button>

            {showPhotoActions ? (
              <div className="absolute left-2 top-full z-10 mt-2 w-36 rounded-md border border-[#2a2d46] bg-[#151a3f] p-1 shadow-lg">
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  className="w-full rounded px-2 py-1.5 text-left text-xs text-slate-200 hover:bg-[#232a5a]"
                >
                  Subir foto
                </button>
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={!hasCustomPhoto}
                    className="w-full rounded px-2 py-1.5 text-left text-xs text-slate-200 hover:bg-[#232a5a] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    Eliminar foto
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-[#2a2d46] bg-[#151a3f] text-slate-100">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar foto de perfil?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-300">
                        Esta acción quitará tu foto actual y volverá a la imagen por defecto.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-[#2a2d46] text-slate-300 hover:bg-[#1c1f38] hover:text-slate-200">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRemovePhoto}
                        className="bg-[#6c72ff] text-white hover:bg-[#5c61eb]"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="fullName" className="text-xs font-semibold text-slate-300">
              Nombre Completo *
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text" pattern="[A-Za-z ]+"
              placeholder="Ej: Juan Perez"
              value={formData.profile_name}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              style={errors.fullName ? { borderColor: "var(--destructive)" } : undefined}
              className="h-11 rounded-xl border bg-[#1f2552] px-4 text-sm text-slate-200 placeholder:text-[#8c91b7] focus-visible:ring-2 focus-visible:ring-[#5d68f5] disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.fullName ? (
              <p className="text-xs" style={{ color: "var(--destructive)" }}>
                {errors.fullName}
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
              Correo *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Ej: user@example.com"
              value={formData.profile_email}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              style={errors.email ? { borderColor: "var(--destructive)" } : undefined}
              className="h-11 rounded-xl border bg-[#1f2552] px-4 text-sm text-slate-200 placeholder:text-[#8c91b7] focus-visible:ring-2 focus-visible:ring-[#5d68f5] disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.email ? (
              <p className="text-xs" style={{ color: "var(--destructive)" }}>
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="profession" className="text-xs font-semibold text-slate-300">
              Profesión *
            </Label>
            <Input
              id="profession"
              name="profession"
              type="text"
              placeholder="Ej: Desarrollador Full Stack"
              value={formData.profession}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              style={errors.profession ? { borderColor: "var(--destructive)" } : undefined}
              className="h-11 rounded-xl border bg-[#1f2552] px-4 text-sm text-slate-200 placeholder:text-[#8c91b7] focus-visible:ring-2 focus-visible:ring-[#5d68f5] disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.profession ? (
              <p className="text-xs" style={{ color: "var(--destructive)" }}>
                {errors.profession}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2.5">
        <Label htmlFor="bio" className="text-xs font-semibold text-slate-300">
          Biografía *
        </Label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Cuéntanos sobre ti, tu experiencia y tus intereses."
          value={formData.bio}
          onChange={handleInputChange}
          onBlur={handleFieldBlur}
          rows={6}
          style={errors.bio ? { borderColor: "var(--destructive)" } : undefined}
          className="w-full rounded-xl border bg-[#1f2552] px-4 py-3 text-sm text-slate-200 placeholder:text-[#8c91b7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5d68f5] disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.bio ? (
          <p className="text-xs" style={{ color: "var(--destructive)" }}>
            {errors.bio}
          </p>
        ) : null}
      </div>

        <div className="mt-6">
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="h-11 rounded-lg bg-[#6c72ff] px-4 text-sm font-medium text-white hover:bg-[#5c61eb] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#6c72ff]"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => {
                setErrors(EMPTY_ERRORS);
                setFormData(initialFormData);
              }}
              disabled={!hasUnsavedChanges}
              className="h-11 rounded-lg border border-[#2a2d46] px-4 text-sm font-medium text-slate-300 hover:bg-[#1c1f38] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Cancelar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

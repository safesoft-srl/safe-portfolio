import { useRef, useState } from "react";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

import { deleteProfilePhoto } from "@/services/profile.service";
import defaultProfileImage from "@/assets/image.png";
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
import { toast } from "sonner";

const DEFAULT_PROFILE_IMAGE = defaultProfileImage;

const VALID_TEXT_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,;:()'"/\-\n\r]+$/;
const VALID_NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const VALID_PROFESSION_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s/-]+$/;
const VALID_CITY_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s.'-]+$/;
const VALID_PHONE_REGEX = /^[0-9+\s()-]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type ProfileFormData = {
  profile_name: string;
  portfolio_name?: string;
  profile_email: string;
  profession: string;
  city: string;
  phone: string;
  bio: string;
  profile_image: string;
  url_portfolio: string;
  is_public: true;
};

export type ProfileFormProps = {
  mode: "create" | "edit";
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData, file: File | null) => void | Promise<void>;
  isLoading?: boolean;
  isSaving?: boolean;
  idPortfolio: number;
};

const EMPTY_ERRORS = {
  portfolioName: "",
  fullName: "",
  email: "",
  profession: "",
  city: "",
  phone: "",
  bio: "",
};

type ProfileField =
  | "portfolioName"
  | "fullName"
  | "email"
  | "profession"
  | "city"
  | "phone"
  | "bio";

export default function ProfileForm({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  isSaving = false,
  idPortfolio,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<Record<ProfileField, string>>(EMPTY_ERRORS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string>(
    initialData.profile_image || DEFAULT_PROFILE_IMAGE
  );
  const [showPhotoActions, setShowPhotoActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoActionsRef = useRef<HTMLDivElement>(null);
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const showPortfolioNameField = mode === "create";

  if (initialData !== prevInitialData) {
    setFormData(initialData);
    setProfileImage(initialData.profile_image || DEFAULT_PROFILE_IMAGE);
    setSelectedFile(null);
    setPrevInitialData(initialData);
  }
  const validateField = (field: ProfileField, value: string) => {
    const trimmedValue = value.trim();
    if (field === "portfolioName") {
      if (trimmedValue.length > 60)
        return "El nombre del portafolio debe tener máximo 60 caracteres.";
      return "";
    }
    if (field === "fullName") {
      if (!trimmedValue) return "El nombre es obligatorio.";
      if (trimmedValue.length < 2 || trimmedValue.length > 50) {
        return "El nombre debe tener entre 2 y 50 caracteres.";
      }
      if (/\d/.test(trimmedValue)) {
        return "El nombre no debe contener números.";
      }
      if (!VALID_NAME_REGEX.test(trimmedValue)) {
        return "El nombre contiene caracteres inválidos.";
      }
      return "";
    }
    if (field === "email") {
      if (!trimmedValue) return "El correo electrónico es obligatorio.";
      if (!EMAIL_REGEX.test(trimmedValue)) {
        return "El correo no tiene un formato válido.";
      }
      return "";
    }
    if (field === "profession") {
      if (trimmedValue.length < 5) {
        return "La profesión debe tener al menos 5 caracteres.";
      }
      if (/\d/.test(trimmedValue)) {
        return "La profesión no debe contener números.";
      }
      if (!VALID_PROFESSION_REGEX.test(trimmedValue)) {
        return "La profesión contiene caracteres inválidos. Solo se permiten letras, espacios, '/' y '-'.";
      }
      return "";
    }
    if (field === "city") {
      if (!trimmedValue) return "";
      if (!VALID_CITY_REGEX.test(trimmedValue)) {
        return "La ciudad contiene caracteres inválidos.";
      }
      return "";
    }
    if (field === "phone") {
      if (!trimmedValue) return "";
      if (!VALID_PHONE_REGEX.test(trimmedValue)) {
        return "El teléfono contiene caracteres inválidos.";
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
    if (name === "portfolio_name" || name === "portfolioName") return "portfolioName";
    if (name === "profile_name" || name === "fullName") return "fullName";
    if (name === "profile_email" || name === "email") return "email";
    if (name === "profession" || name === "professionName") return "profession";
    if (name === "city") return "city";
    if (name === "phone") return "phone";
    return "bio";
  };

  const getStateKey = (field: ProfileField) => {
    if (field === "fullName") return "profile_name";
    if (field === "email") return "profile_email";
    if (field === "portfolioName") return "portfolio_name";
    return field;
  };

  const hasUnsavedChanges =
    formData.portfolio_name !== initialData.portfolio_name ||
    formData.profile_name !== initialData.profile_name ||
    formData.profile_email !== initialData.profile_email ||
    formData.profession !== initialData.profession ||
    formData.city !== initialData.city ||
    formData.phone !== initialData.phone ||
    formData.bio !== initialData.bio ||
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

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setProfileImage(URL.createObjectURL(file));
    setFormData({
      ...formData,
      profile_image: URL.createObjectURL(file),
    });
    setShowPhotoActions(false);
  };

  const handleRemovePhoto = async () => {
    try {
      setSelectedFile(null);
      setFormData({
        ...formData,
        profile_image: DEFAULT_PROFILE_IMAGE,
      });
      setProfileImage(DEFAULT_PROFILE_IMAGE);
      await deleteProfilePhoto(idPortfolio);
      setShowPhotoActions(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      toast.error("Error al eliminar la foto de perfil");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<ProfileField, string> = {
      portfolioName: validateField("portfolioName", formData.portfolio_name ?? ""),
      fullName: validateField("fullName", formData.profile_name),
      email: validateField("email", formData.profile_email),
      profession: validateField("profession", formData.profession),
      city: validateField("city", formData.city),
      phone: validateField("phone", formData.phone),
      bio: validateField("bio", formData.bio),
    };
    setErrors(nextErrors);
    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;
    onSubmit(formData, selectedFile);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[60vh] mt-36">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6c72ff] border-t-transparent" />
          <span className="text-sm text-slate-700 dark:text-slate-200">Cargando...</span>
        </div>
      </div>
    );
  }

  const hasCustomPhoto = profileImage !== DEFAULT_PROFILE_IMAGE;

  return (
    <form onSubmit={handleSubmit} className="w-full bg-slate-900 rounded-2xl p-4 sm:p-5">
      <h2 className="mb-4 text-2xl font-semibold">
        {mode === "edit" ? "Información Básica" : "Crear Perfil de Portafolio"}
      </h2>
      <div className="border-b border-slate-800 mb-8"></div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
        <div className="space-y-5">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Foto de Perfil
          </Label>
          <div ref={photoActionsRef} className="relative mx-auto -mt-8 w-fit">
            <Avatar className="h-60 w-60">
              <AvatarImage
                src={formData.profile_image || DEFAULT_PROFILE_IMAGE}
                alt="Foto de perfil"
              />
              <AvatarFallback className="bg-[#21264f] text-[6.5rem] font-semibold text-white"></AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {mode === "create" ? (
              <Button
                type="button"
                size="sm"
                variant="default"
                className="absolute bottom-2 left-2 px-2 h-7"
                onClick={handleUploadPhoto}
              >
                Subir foto
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="absolute bottom-2 left-2 px-2 h-7 gap-1"
                  onClick={() => setShowPhotoActions((prev) => !prev)}
                >
                  <PencilSimpleLineIcon size={32} />
                  Editar
                </Button>
                {showPhotoActions ? (
                  <div className="absolute left-2 top-full z-10 mt-2 w-36 rounded-md border border-sidebar-border dark:border-[#2a2d46] bg-white dark:bg-[#151a3f] p-1 shadow-lg">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full rounded px-2 py-1.5 text-left text-xs justify-start text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#232a5a]"
                      onClick={handleUploadPhoto}
                    >
                      {hasCustomPhoto ? "Actualizar foto" : "Subir foto"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        disabled={!hasCustomPhoto}
                        className="w-full rounded px-2 py-1.5 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#232a5a] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                      >
                        Eliminar foto
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-sidebar-border dark:border-bg-slate-900 bg-white dark:bg-[#151a3f] text-slate-900 dark:text-slate-100">
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar foto de perfil?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-600 dark:text-slate-300">
                            Esta acción quitará tu foto actual y volverá a la imagen por defecto.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-sidebar-border dark:border-[#2a2d46] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1f38] hover:text-slate-900 dark:hover:text-slate-200">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleRemovePhoto}
                            className="bg-[#e53e3e] text-white hover:bg-[#c53030]"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : null}
              </>
            )}
          </div>
          <div className="-mt-4 space-y-2.5">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="bio"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Sobre mi *
              </Label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formData.bio.length}/300
              </span>
            </div>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Cuéntanos sobre ti, tu experiencia y tus intereses."
              value={formData.bio}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              maxLength={300}
              rows={6}
              required
              style={errors.bio ? { borderColor: "var(--destructive)" } : undefined}
              className="h-24 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 resize-none font-sans"
            />
            {errors.bio ? (
              <p className="text-xs" style={{ color: "var(--destructive)" }}>
                {errors.bio}
              </p>
            ) : null}
          </div>
        </div>
        <div className="space-y-5">
          {showPortfolioNameField ? (
            <div className="space-y-2.5">
              <Label
                htmlFor="portfolioName"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Nombre de Portafolio
              </Label>
              <Input
                id="portfolioName"
                name="portfolioName"
                type="text"
                placeholder="Ej: Portafolio - Developer"
                value={formData.portfolio_name ?? ""}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                className="h-8 border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm"
              />
              {errors.portfolioName ? (
                <p className="text-xs" style={{ color: "var(--destructive)" }}>
                  {errors.portfolioName}
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="space-y-2.5">
            <Label
              htmlFor="fullName"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Nombre Completo *
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+"
              placeholder="Ej: Diego Maldonado"
              value={formData.profile_name}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              disabled={mode !== "create"}
              style={errors.fullName ? { borderColor: "var(--destructive)" } : undefined}
              className="h-8 border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.fullName ? (
              <p className="text-xs" style={{ color: "var(--destructive)" }}>
                {errors.fullName}
              </p>
            ) : null}
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Correo *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Ej: correo@dominio.com"
              value={formData.profile_email}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
              required
              style={errors.email ? { borderColor: "var(--destructive)" } : undefined}
              className="h-8 border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.email ? (
              <p className="text-xs" style={{ color: "var(--destructive)" }}>
                {errors.email}
              </p>
            ) : null}
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="profession"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
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
              pattern=".*"
              required
              className="h-8 border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.profession ? (
              <p className="text-xs" style={{ color: "var(--destructive)" }}>
                {errors.profession}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label
                htmlFor="city"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Ciudad
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Ej: Buenos Aires"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                style={errors.city ? { borderColor: "var(--destructive)" } : undefined}
                className="h-8 border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.city ? (
                <p className="text-xs" style={{ color: "var(--destructive)" }}>
                  {errors.city}
                </p>
              ) : null}
            </div>
            <div className="space-y-2.5">
              <Label
                htmlFor="phone"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="Ej: +591 67563184"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                style={errors.phone ? { borderColor: "var(--destructive)" } : undefined}
                className="h-8 border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.phone ? (
                <p className="text-xs" style={{ color: "var(--destructive)" }}>
                  {errors.phone}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-slate-800 my-6"></div>
      <div className="mt-6">
        <div className="flex justify-center gap-3">
          <Button type="submit" size="lg" disabled={isSaving || !hasUnsavedChanges}>
            {isSaving ? (
              <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full inline-block align-middle" />
            ) : mode === "edit" ? (
              "Guardar Cambios"
            ) : (
              "Crear Perfil"
            )}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => {
              setErrors(EMPTY_ERRORS);
              setFormData(initialData);
              setSelectedFile(null);
              setProfileImage(initialData.profile_image || DEFAULT_PROFILE_IMAGE);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            disabled={isSaving || !hasUnsavedChanges}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  );
}

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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

const DEFAULT_PROFILE_IMAGE = defaultProfileImage;

const VALID_TEXT_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,;:()'"/\-\n\r]+$/;
const VALID_NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const VALID_PROFESSION_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s/-]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type ProfileFormData = {
  profile_name: string;
  profile_email: string;
  profession: string;
  bio: string;
  url_photo: string;
  url_portfolio: string;
};

export type ProfileFormProps = {
  mode: "create" | "edit";
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData, file: File | null) => void | Promise<void>;
  isLoading?: boolean;
  isSaving?: boolean;
};

const EMPTY_ERRORS = {
  fullName: "",
  email: "",
  profession: "",
  bio: "",
};

type ProfileField = "fullName" | "email" | "profession" | "bio";

export default function ProfileForm({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  isSaving = false,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<Record<ProfileField, string>>(EMPTY_ERRORS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string>(
    initialData.url_photo || DEFAULT_PROFILE_IMAGE
  );
  const [showPhotoActions, setShowPhotoActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoActionsRef = useRef<HTMLDivElement>(null);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (initialData !== prevInitialData) {
    setFormData(initialData);
    setProfileImage(initialData.url_photo || DEFAULT_PROFILE_IMAGE);
    setSelectedFile(null);
    setPrevInitialData(initialData);
  }
  const validateField = (field: ProfileField, value: string) => {
    const trimmedValue = value.trim();
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
    formData.profile_name !== initialData.profile_name ||
    formData.profile_email !== initialData.profile_email ||
    formData.profession !== initialData.profession ||
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
      url_photo: URL.createObjectURL(file),
    });
    setShowPhotoActions(false);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setFormData({
      ...formData,
      url_photo: DEFAULT_PROFILE_IMAGE,
    });
    setProfileImage(DEFAULT_PROFILE_IMAGE);
    setShowPhotoActions(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<ProfileField, string> = {
      fullName: validateField("fullName", formData.profile_name),
      email: validateField("email", formData.profile_email),
      profession: validateField("profession", formData.profession),
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
    <form onSubmit={handleSubmit} className="w-full bg-slate-900 rounded-2xl p-6">
      <h2 className="mb-8 text-2xl font-semibold">
        {mode === "edit" ? "Información Básica" : "Crear Perfil"}
      </h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
        <div className="space-y-5">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Foto de Perfil
          </Label>
          <div ref={photoActionsRef} className="relative mx-auto -mt-8 w-fit">
            <Avatar className="h-60 w-60">
              <AvatarImage src={formData.url_photo} alt="Foto de perfil" />
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
                  <span aria-hidden="true" className="text-xs leading-none">
                    ✎
                  </span>
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
                      <AlertDialogContent className="border-sidebar-border dark:border-[#2a2d46] bg-white dark:bg-[#151a3f] text-slate-900 dark:text-slate-100">
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
        </div>
        <div className="space-y-5">
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
              placeholder="Ej: Juan Perez"
              value={formData.profile_name}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
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
              placeholder="Ej: example1@gmail.com"
              pattern="[a-z0-9]+@gmail\.com"
              value={formData.profile_email}
              onChange={handleInputChange}
              onBlur={handleFieldBlur}
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
              className="h-8 border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
        <Label htmlFor="bio" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Sobre mi *
        </Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Cuéntanos sobre ti, tu experiencia y tus intereses."
          value={formData.bio}
          onChange={handleInputChange}
          onBlur={handleFieldBlur}
          rows={6}
          style={errors.bio ? { borderColor: "var(--destructive)" } : undefined}
          className="h-24 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 resize-none font-sans"
        />
        {errors.bio ? (
          <p className="text-xs" style={{ color: "var(--destructive)" }}>
            {errors.bio}
          </p>
        ) : null}
      </div>
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
              setProfileImage(initialData.url_photo || DEFAULT_PROFILE_IMAGE);
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

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleNotchIcon, UploadSimple, Trash } from "@phosphor-icons/react";
import { toast } from "sonner"; // Importamos sonner para las notificaciones

// 1. Definimos los formatos aceptados para mayor seguridad
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

// 2. Creamos un validador personalizado reutilizable en Zod
const imageValidator = z
  .custom<FileList>()
  .optional()
  .refine(
    (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
    "Solo se permiten formatos de imagen válidos (.jpg, .png, .webp, .svg)"
  );

const skillSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  logo_light: imageValidator,
  logo_dark: imageValidator,
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormProps {
  // Actualizamos el tipo para que acepte promesas, así podemos atrapar errores
  onSubmit: (data: {
    name: string;
    category: string;
    logo_light?: File;
    logo_dark?: File;
  }) => void | Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  initialData?: {
    id?: number;
    name: string;
    category: string;
    url_light?: string;
    url_dark?: string;
  } | null;
}

const categories = ["Frontend", "Backend", "DevOps", "Otros"];

export function SkillForm({ onSubmit, isLoading, onCancel, initialData }: SkillFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      logo_light: undefined,
      logo_dark: undefined,
    },
  });

  const [previewLight, setPreviewLight] = useState<string | null>(initialData?.url_light || null);
  const [previewDark, setPreviewDark] = useState<string | null>(initialData?.url_dark || null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, type: "light" | "dark") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación extra a nivel de componente antes de generar el preview
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Formato no soportado. Por favor sube una imagen.", {
        position: "bottom-right",
      });
      clearLogo(type);
      return;
    }

    const preview = URL.createObjectURL(file);

    if (type === "light") {
      setPreviewLight(preview);
    } else {
      setPreviewDark(preview);
    }
  };

  const clearLogo = (type: "light" | "dark") => {
    const input = document.getElementById(`${type}-logo-input`) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
    if (type === "light") {
      setPreviewLight(null);
    } else {
      setPreviewDark(null);
    }
  };

  const onSubmitForm = async (data: SkillFormData) => {
    try {
      await onSubmit({
        name: data.name,
        category: data.category,
        logo_light: data.logo_light?.[0],
        logo_dark: data.logo_dark?.[0],
      });

      // Notificación de éxito en la esquina inferior derecha
      toast.success(
        initialData ? "Habilidad actualizada correctamente" : "Habilidad creada con éxito",
        { position: "bottom-right" }
      );
    } catch (error: unknown) {
      // Notificación de fallo
      toast.error("Hubo un error al procesar la habilidad", {
        position: "bottom-right",
      });
      console.error(error);
    }
  };

  const renderUploader = (type: "light" | "dark", preview: string | null) => {
    const fieldName = type === "light" ? "logo_light" : "logo_dark";
    const logoField = register(fieldName);
    const hasError = errors[fieldName];

    return (
      <div className="space-y-2">
        <Label className="text-slate-300">Logo ({type === "light" ? "Claro" : "Oscuro"})</Label>

        <label
          htmlFor={`${type}-logo-input`}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-all h-32 relative
            ${hasError ? "border-red-500 bg-red-500/10" : "bg-slate-950 border-slate-800 hover:border-[#6c72ff]"}`}
        >
          {preview ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={preview}
                alt="Preview"
                className="h-16 rounded shadow border border-slate-800 object-contain"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-slate-800 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearLogo(type);
                }}
              >
                <Trash size={18} />
              </button>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center gap-2 ${hasError ? "text-red-400" : "text-slate-400"}`}
            >
              <UploadSimple size={32} />
              <span className="text-xs text-center px-4">
                {hasError
                  ? errors[fieldName]?.message?.toString()
                  : "Arrastra o selecciona imagen (.png, .svg, .webp)"}
              </span>
            </div>
          )}

          <Input
            id={`${type}-logo-input`}
            type="file"
            // Restricción nativa del navegador para que solo permita elegir imágenes en la ventana
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            {...logoField}
            onChange={(e) => {
              handleLogoChange(e, type);
              logoField.onChange(e);
            }}
            className="hidden"
          />
        </label>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300">Nombre de la Skill</Label>
        <Input
          {...register("name")}
          placeholder="Ej: React, Node.js"
          className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-[#6c72ff]"
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300">Categoría</Label>

        <select
          {...register("category")}
          defaultValue=""
          className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6c72ff]"
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {renderUploader("light", previewLight)}
        {renderUploader("dark", previewDark)}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-24 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="w-24 bg-[#6c72ff] hover:bg-[#5a60d6] text-white"
          disabled={isLoading}
        >
          {isLoading ? <CircleNotchIcon className="animate-spin" /> : "Guardar"}
        </Button>
      </div>
    </form>
  );
}

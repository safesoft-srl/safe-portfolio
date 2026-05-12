import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleNotchIcon, UploadSimple, Trash } from "@phosphor-icons/react";

const skillSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  logo_light: z.any().optional(),
  logo_dark: z.any().optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormProps {
  onSubmit: (data: SkillFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const categories = ["Frontend", "Backend", "DevOps", "Otros"];

export function SkillForm({ onSubmit, isLoading, onCancel }: SkillFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", category: "", logo_light: undefined, logo_dark: undefined },
  });

  const [previewLight, setPreviewLight] = useState<string | null>(null);
  const [previewDark, setPreviewDark] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, type: "light" | "dark") => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (type === "light") {
      setPreviewLight(preview);
    } else {
      setPreviewDark(preview);
    }
  };

  const clearLogo = (type: "light" | "dark") => {
    const input = document.getElementById(`logo-${type}-input`) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
    if (type === "light") {
      setPreviewLight(null);
    } else {
      setPreviewDark(null);
    }
  };

  const onSubmitForm = (data: SkillFormData) => {
    onSubmit({
      name: data.name,
      category: data.category,
      logo_light: data.logo_light?.[0],
      logo_dark: data.logo_dark?.[0],
    });
  };

  const renderUploader = (type: "light" | "dark", preview: string | null) => {
    const fieldName = type === "light" ? "logo_light" : "logo_dark";

    const logoField = register(fieldName);

    return (
      <div className="space-y-2">
        <Label className="text-slate-300">Logo ({type === "light" ? "Claro" : "Oscuro"})</Label>

        <label
          htmlFor={`${type}-logo-input`}
          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-all h-32 bg-slate-950 border-slate-800 hover:border-indigo-500 relative"
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
                className="absolute top-2 right-2 bg-slate-800 hover:bg-red-600 text-white rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  clearLogo(type);
                }}
              >
                <Trash size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <UploadSimple size={32} />
              <span className="text-xs">Arrastra o selecciona imagen</span>
            </div>
          )}

          <Input
            id={`${type}-logo-input`}
            type="file"
            accept="image/*"
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
          className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300">Categoría</Label>

        <select
          {...register("category")}
          defaultValue=""
          className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      {renderUploader("light", previewLight)}
      {renderUploader("dark", previewDark)}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" className="w-24" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="w-24" disabled={isLoading}>
          {isLoading ? <CircleNotchIcon className="animate-spin" /> : "Guardar"}
        </Button>
      </div>
    </form>
  );
}

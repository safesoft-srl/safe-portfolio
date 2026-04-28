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
  logo: z.any().optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormProps {
  onSubmit: (data: SkillFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

{/*Componente del formulario*/}
export function SkillForm({ onSubmit, isLoading, onCancel }: SkillFormProps) {
    //inicializacion del formulario.
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", category: "", logo: undefined },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  {/*Cuando se selecciona un archivo*/}
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const onSubmitForm = (data: SkillFormData) => {
    const file = data.logo?.[0];

    onSubmit({
      name: data.name,
      category: data.category,
      logo: file,
    });
  }

  {/*Cuando se suelta un archivo*/}
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const dt = new DataTransfer();
      dt.items.add(file);
      const input = document.getElementById("logo-input") as HTMLInputElement;
      if (input) {
        input.files = dt.files;
        const event = new Event("change", { bubbles: true });
        input.dispatchEvent(event);
      }
    }
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
        <Input
          {...register("category")}
          placeholder="Ej: backend, frontend"
          className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
        />
        {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
      </div>
      <div className="space-y-2">
        <Label className="text-slate-300">Logo</Label>
        <label
          htmlFor="logo-input"
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-all h-32 bg-slate-950 border-slate-800 hover:border-indigo-500 focus-within:border-indigo-500 relative ${dragActive ? "border-indigo-500 bg-slate-900/60" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="flex flex-col items-center gap-2">
              <img src={preview} alt="Preview" className="h-16 rounded shadow border border-slate-800 object-contain" />
              <button
                type="button"
                className="absolute top-2 right-2 bg-slate-800 hover:bg-red-600 text-white rounded-full p-1 shadow"
                onClick={e => {
                  e.stopPropagation();
                  setPreview(null);
                  const input = document.getElementById("logo-input") as HTMLInputElement;
                  if (input) input.value = "";
                }}
                title="Eliminar imagen"
              >
                <Trash size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <UploadSimple size={32} />
              <span className="text-xs">Arrastra una imagen aquí o haz clic para seleccionar</span>
            </div>
          )}
          <Input
            id="logo-input"
            type="file"
            accept="image/*"
            {...register("logo")}
            onChange={e => {
              handleLogoChange(e);
              register("logo").onChange(e);
            }}
            className="hidden"
          />
        </label>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-24"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" className="w-24" disabled={isLoading}>
          {isLoading ? <CircleNotchIcon className="animate-spin" /> : "Guardar"}
        </Button>
      </div>
    </form>
  );
}

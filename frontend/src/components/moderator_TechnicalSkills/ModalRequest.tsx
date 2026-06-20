import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleNotchIcon, UploadSimple, Trash } from "@phosphor-icons/react";

interface ModalRequestProps {
  initialName: string;
  onSubmit: (data: { name: string; category: string; logo_light?: File; logo_dark?: File }) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const categories = ["Frontend", "Backend", "DevOps", "Otros"];

export default function ModalRequest({
  initialName,
  onSubmit,
  isLoading,
  onCancel,
}: ModalRequestProps) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState("");
  const [logoLight, setLogoLight] = useState<File | undefined>();
  const [logoDark, setLogoDark] = useState<File | undefined>();

  const [previewLight, setPreviewLight] = useState<string | null>(null);
  const [previewDark, setPreviewDark] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, type: "light" | "dark") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (type === "light") {
      setLogoLight(file);
      setPreviewLight(preview);
    } else {
      setLogoDark(file);
      setPreviewDark(preview);
    }
  };

  const clearLogo = (type: "light" | "dark") => {
    const input = document.getElementById(`${type}-logo-input`) as HTMLInputElement;

    if (input) {
      input.value = "";
    }

    if (type === "light") {
      setLogoLight(undefined);
      setPreviewLight(null);
    } else {
      setLogoDark(undefined);
      setPreviewDark(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("El nombre es requerido");
      return;
    }

    if (!category) {
      alert("La categoría es requerida");
      return;
    }

    onSubmit({
      name,
      category,
      logo_light: logoLight,
      logo_dark: logoDark,
    });
  };

  const renderUploader = (type: "light" | "dark", preview: string | null) => {
    return (
      <div className="space-y-2">
        <Label className="text-slate-300">Logo ({type === "light" ? "Claro" : "Oscuro"})</Label>

        <label
          htmlFor={`${type}-logo-input`}
          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-all h-32 bg-slate-950 border-slate-800 hover:border-[#6c72ff] relative"
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
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <UploadSimple size={32} />
              <span className="text-xs">Arrastra o selecciona imagen</span>
            </div>
          )}

          <Input
            id={`${type}-logo-input`}
            type="file"
            accept="image/*"
            onChange={(e) => handleLogoChange(e, type)}
            className="hidden"
          />
        </label>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* NAME */}
      <div className="space-y-2">
        <Label className="text-slate-300">Nombre de la Skill</Label>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: React, Node.js"
          className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-[#6c72ff]"
        />
      </div>

      {/* CATEGORY */}
      <div className="space-y-2">
        <Label className="text-slate-300">Categoría</Label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6c72ff]"
        >
          <option value="">Selecciona una categoría</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {renderUploader("light", previewLight)}
      {renderUploader("dark", previewDark)}

      {/* BUTTONS */}
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

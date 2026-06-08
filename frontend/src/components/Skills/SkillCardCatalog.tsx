import { Card, CardContent } from "@/components/ui/card";
import { PencilSimpleIcon, EyeSlash, Eye } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export interface CatalogSkill {
  id: number;
  name: string;
  category: string;
  url_light?: string;
  url_dark?: string;
  is_active: boolean;
}

interface SkillCardProps {
  skill: CatalogSkill;
  onEdit?: (skill: CatalogSkill) => void;
  onToggleStatus?: (id: number, currentStatus: boolean) => void;
}

export function SkillCardCatalog({ skill, onEdit, onToggleStatus }: SkillCardProps) {
  const { id, name, category, url_dark, is_active } = skill;

  return (
    <Card
      className={`relative flex flex-col bg-[#13152e] border ${
        is_active ? "border-[#232555] hover:border-[#6c72ff]/50" : "border-red-900/50 opacity-80"
      } rounded-2xl overflow-hidden shadow-2xl transition-all group h-full`}
    >
      <CardContent className="p-6 flex flex-col items-center text-center grow">
        <div
          className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-[#1c1f38] border ${
            is_active ? "border-[#232555]" : "border-red-900/50"
          } shadow-inner`}
        >
          {url_dark ? (
            <img
              src={url_dark}
              alt={name}
              className={`w-10 h-10 object-contain ${!is_active ? "grayscale opacity-50" : ""}`}
            />
          ) : (
            <span
              className={`font-bold text-2xl ${is_active ? "text-[#6c72ff]" : "text-slate-600"}`}
            >
              {name.charAt(0)}
            </span>
          )}
        </div>

        <h3 className={`font-bold text-xl mb-1 ${is_active ? "text-white" : "text-slate-500"}`}>
          {name}
        </h3>

        <p className="text-slate-500 text-xs uppercase tracking-widest">{category}</p>

        <div className="w-full mt-6 pt-4 border-t border-[#232555] flex gap-2">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(skill);
            }}
            className="flex-1 bg-[#1c1f38] border-[#232555] text-slate-300 hover:bg-[#6c72ff] hover:text-white transition-colors h-9 px-0"
          >
            <PencilSimpleIcon size={16} weight="bold" className="mr-2" />
            Editar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              onClick={(e) => e.stopPropagation()}
              className={`flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium border h-9 px-0 transition-colors ${
                is_active
                  ? "bg-[#1c1f38] text-amber-500 border-[#232555] hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400"
              }`}
            >
              {is_active ? (
                <>
                  <EyeSlash size={16} weight="bold" className="mr-2" />
                  Desactivar
                </>
              ) : (
                <>
                  <Eye size={16} weight="bold" className="mr-2" />
                  Activar
                </>
              )}
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-[#13152e] border border-[#232555]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  {is_active ? "¿Desactivar tecnología?" : "¿Activar tecnología?"}
                </AlertDialogTitle>

                <AlertDialogDescription className="text-slate-400">
                  {is_active
                    ? `Al desactivar ${name}, los usuarios actuales la conservarán, pero ya no aparecerá disponible para nuevos registros en el catálogo.`
                    : `Al activar ${name}, volverá a estar disponible en el catálogo global para que cualquier usuario pueda agregarla.`}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#1c1f38] text-white border-none hover:bg-[#232555]">
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => onToggleStatus?.(id, is_active)}
                  className={`${
                    is_active
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  } text-white border-none`}
                >
                  {is_active ? "Desactivar" : "Activar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

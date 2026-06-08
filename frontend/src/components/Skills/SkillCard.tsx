import { Card, CardContent } from "@/components/ui/card";
import { PencilSimpleIcon, TrashIcon, EyeSlash, Eye } from "@phosphor-icons/react";
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

export interface UserSkill {
  id: number;
  technical_skill_id: number;
  portfolio_id: number;
  level: string;
  technical_skill: CatalogSkill;
}

interface SkillCardProps {
  skill: UserSkill | CatalogSkill;
  role?: "user" | "moderator";
  onEdit?: (skill: UserSkill | CatalogSkill) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number, currentStatus: boolean) => void;
}

export function SkillCard({
  skill,
  role = "user",
  onEdit,
  onDelete,
  onToggleStatus,
}: SkillCardProps) {
  const isPortfolioSkill = "level" in skill;

  const skillId = isPortfolioSkill ? skill.technical_skill_id : skill.id;
  const skillName = isPortfolioSkill ? skill.technical_skill.name : skill.name;
  const skillCategory = isPortfolioSkill ? skill.technical_skill.category : skill.category;
  const skillIcon = isPortfolioSkill ? skill.technical_skill.url_dark : skill.url_dark;
  const isActive = isPortfolioSkill ? true : (skill as CatalogSkill).is_active;

  return (
    <Card
      className={`relative flex flex-col bg-[#13152e] border ${isActive ? "border-[#232555] hover:border-[#6c72ff]/50" : "border-red-900/50 opacity-80"} rounded-2xl overflow-hidden shadow-2xl transition-all group h-full`}
    >
      {/* CONTROLES FLOTANTES (SOLO PARA USUARIO NORMAL) */}
      {role === "user" && isPortfolioSkill && (
        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(skill);
            }}
            className="w-8 h-8 rounded-full bg-[#1c1f38] border border-[#232555] hover:bg-[#6c72ff] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-lg p-0"
            title="Editar nivel"
          >
            <PencilSimpleIcon size={16} weight="bold" />
          </Button>

          <AlertDialog>
            {/* SIN asChild: Aplicamos las clases directamente al Trigger */}
            <AlertDialogTrigger
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-[#1c1f38] border border-[#232555] hover:bg-red-500 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-lg p-0"
              title="Eliminar habilidad"
            >
              <TrashIcon size={16} weight="bold" />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#13152e] border border-[#232555]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">¿Eliminar habilidad?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Se eliminará permanentemente la habilidad{" "}
                  <b className="text-white">{skillName}</b> de tu portafolio.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#1c1f38] text-white border-none hover:bg-[#232555]">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete && onDelete(skillId)}
                  className="bg-red-600 text-white hover:bg-red-700 border-none"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
        <div
          className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-[#1c1f38] border ${isActive ? "border-[#232555]" : "border-red-900/50"} shadow-inner`}
        >
          {skillIcon ? (
            <img
              src={skillIcon}
              alt={skillName}
              className={`w-10 h-10 object-contain ${!isActive ? "grayscale opacity-50" : ""}`}
              onError={(e) => {
                e.currentTarget.src = "/default-skill.png";
              }}
            />
          ) : (
            <span
              className={`font-bold text-2xl ${isActive ? "text-[#6c72ff]" : "text-slate-600"}`}
            >
              {skillName.charAt(0)}
            </span>
          )}
        </div>

        <h3 className={`font-bold text-xl mb-1 ${isActive ? "text-white" : "text-slate-500"}`}>
          {skillName}
        </h3>

        <p className="text-slate-500 text-xs uppercase tracking-widest">{skillCategory}</p>

        {isPortfolioSkill && (
          <div className="mt-6 pt-4 border-t border-[#232555] w-full text-[#6c72ff] text-xs font-bold uppercase tracking-widest">
            Nivel {(skill as UserSkill).level}
          </div>
        )}

        {/* BARRA DE ACCIONES FIJA (SOLO PARA MODERADOR) */}
        {role === "moderator" && (
          <div className="w-full mt-6 pt-4 border-t border-[#232555] flex gap-2">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(skill);
              }}
              className="flex-1 bg-[#1c1f38] border-[#232555] text-slate-300 hover:bg-[#6c72ff] hover:text-white transition-colors h-9 px-0"
            >
              <PencilSimpleIcon size={16} weight="bold" className="mr-2" />
              Editar
            </Button>

            <AlertDialog>
              {/* SIN asChild: Aplicamos las clases de diseño estructural del botón al Trigger */}
              <AlertDialogTrigger
                onClick={(e) => e.stopPropagation()}
                className={`flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium border h-9 px-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-[#1c1f38] text-amber-500 border-[#232555] hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-400"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400"
                }`}
              >
                {isActive ? (
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
                    {isActive ? "¿Desactivar tecnología?" : "¿Activar tecnología?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    {isActive
                      ? `Al desactivar ${skillName}, los usuarios actuales la conservarán, pero ya no aparecerá disponible para nuevos registros en el catálogo.`
                      : `Al activar ${skillName}, volverá a estar disponible en el catálogo global para que cualquier usuario pueda agregarla.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-[#1c1f38] text-white border-none hover:bg-[#232555]">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onToggleStatus && onToggleStatus(skillId, isActive)}
                    className={`${isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"} text-white border-none`}
                  >
                    {isActive ? "Desactivar" : "Activar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

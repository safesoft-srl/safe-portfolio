import { Card, CardContent } from "@/components/ui/card";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
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


export interface UserSkill {
  id: number;
  technical_skill_id: number;
  portfolio_id: number;
  level: string;
  technical_skill?: {
    id: number;
    name: string;
    category: string;
    icon_url: string;
  };
}

interface SkillCardProps {
  skill: UserSkill;
  onEdit: (skill: UserSkill) => void;
  onDelete: (id: number) => void;
}

export function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  // Valores por defecto por si alguna relación viene vacía
  const skillName = skill.technical_skill?.name || "Sin nombre";
  const skillCategory = skill.technical_skill?.category || "Sin categoría";
  const skillIcon = skill.technical_skill?.icon_url || "/default-skill.png";

  return (
    <Card className="relative bg-[#13152e] border border-[#232555] rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-[#6c72ff]/50 group">
      
      {/* CONTENEDOR DE ACCIONES (Lápiz y Basura) */}
      <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        
        {/* BOTÓN EDITAR */}
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(skill);
          }}
          className="w-8 h-8 rounded-full bg-[#1c1f38] border border-[#232555] hover:bg-[#6c72ff] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-lg p-0"
          title="Editar nivel"
        >
          <PencilSimpleIcon size={16} weight="bold" />
        </Button>

        {/* Delete Dialog */}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-[#1c1f38] border border-[#232555] hover:bg-[#6c72ff] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-lg p-0"
                title="Eliminar habilidad"
              >
                <TrashIcon size={16} weight="bold" />
              </Button>
            }
          />

          <AlertDialogContent className="bg-[#13152e] border border-[#232555]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                ¿Eliminar habilidad?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                Esta acción no se puede deshacer. Se eliminará permanentemente la habilidad{" "}
                <b className="text-white">{skillName}</b> de tu portafolio.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel 
                className="bg-[#1c1f38] text-white border-none hover:bg-[#232555]"
              >
                Cancelar
              </AlertDialogCancel>
              
              <AlertDialogAction
                onClick={() => onDelete(skill.technical_skill_id)}
                className="bg-red-600 text-white hover:bg-red-700 border-none"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* CONTENIDO DE LA TARJETA */}
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-[#1c1f38] border border-[#232555] shadow-inner">
          <img
            src={skillIcon}
            alt={skillName}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/default-skill.png";
            }}
          />
        </div>

        <h3 className="text-white font-bold text-xl mb-1">{skillName}</h3>
        
        <p className="text-slate-500 text-xs uppercase tracking-widest">
          {skillCategory}
        </p>
        
        <div className="mt-6 pt-4 border-t border-[#232555] w-full text-[#6c72ff] text-xs font-bold uppercase tracking-widest">
          Nivel {skill.level}
        </div>
      </CardContent>
    </Card>
  );
}
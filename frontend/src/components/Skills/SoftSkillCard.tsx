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

export interface SoftSkill {
  id: number;
  description: string | null;

  soft_skill: {
    id: number;
    name: string;
    is_active: boolean;
  };
}

interface SoftSkillCardProps {
  skill: SoftSkill;
  onEdit: (skill: SoftSkill) => void;
  onDelete: (id: number) => void;
}

export function SoftSkillCard({ skill, onEdit, onDelete }: SoftSkillCardProps) {
  const isInactive = !skill.soft_skill.is_active;

  return (
    <Card className="relative  rounded-2xl  overflow-hidden  shadow-2xl  transition-all  group  h-full  flex  flex-col  bg-[#13152e]  border  border-[#232555] hover:border-[#6c72ff]/50">
      <div className=" absolute top-3 right-3 z-20 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 ">
        <Button
          variant="ghost"
          onClick={() => onEdit(skill)}
          className="w-8 h-8 rounded-full bg-[#1c1f38] border border-[#232555] hover:bg-[#6c72ff] text-slate-300 hover:text-white flex items-center justify-center p-0 shadow-lg"
        >
          <PencilSimpleIcon size={16} weight="bold" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                className="w-8 h-8 rounded-full bg-[#1c1f38] border border-[#232555] hover:bg-red-500 text-slate-300 hover:text-white flex items-center justify-center p-0 shadow-lg"
              >
                <TrashIcon size={16} weight="bold" />
              </Button>
            }
          />

          <AlertDialogContent className="bg-[#13152e] border border-[#232555]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                ¿Eliminar habilidad blanda?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-slate-400">
                Se eliminará permanentemente <b>{skill.soft_skill.name}</b> de tu portafolio.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#1c1f38] text-white border-none hover:bg-[#232555]">
                Cancelar
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={() => onDelete(skill.id)}
                className="bg-red-600 text-white hover:bg-red-700 border-none"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CardContent className="p-6 flex flex-col flex-1">
        <div className="mt-2 mb-4">
          <h3 className="font-bold text-xl text-[#6c72ff]">{skill.soft_skill.name}</h3>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed flex-1">
          {skill.description || (
            <span className="text-slate-600 italic">Sin descripción proporcionada.</span>
          )}
        </p>

        {isInactive && (
          <div className="mt-4 rounded-xl border border-[#6c72ff]/50 bg-[#6c72ff]/20 p-3">
            <p className="text-sm text-[#d4d6ff]">
              <span className="block font-semibold text-white mb-1">Importante</span>
              Esta habilidad fue desactivada por moderación. Ya no puede agregarse a nuevos
              portafolios, pero seguirá apareciendo en los portafolios que ya la utilizaban. Si la
              eliminas, no podrás volver a agregarla mientras permanezca desactivada.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

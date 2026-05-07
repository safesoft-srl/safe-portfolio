import { useState } from "react";
import { SoftSkillCard, type SoftSkill } from "@/components/Skills/SoftSkillCard";
import { SoftSkillModal } from "@/components/Skills/SoftSkillModal";

export default function PruebaSkill() {
  // 1. Datos falsos (estado) para probar la tarjeta blanda
  const [dummySoftSkill, setDummySoftSkill] = useState<SoftSkill>({
    id: 1,
    name: "Liderazgo Efectivo",
    description: "Capacidad para guiar equipos multidisciplinarios hacia objetivos comunes, fomentando un ambiente de colaboración y crecimiento continuo.",
  });

  // 2. Estados para el Modal de Edición/Creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<SoftSkill | null>(null);

  // 3. Handlers para la Tarjeta
  const handleEditOpen = (skill: SoftSkill) => {
    setSkillToEdit(skill);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log("Se confirmó la ELIMINACIÓN de la soft skill ID:", id);
    alert(`Simulando eliminación... ID enviado: ${id}`);
  };

  // 4. Handler para el Modal (Simula la llamada a la API)
  const handleSaveSkill = async (data: { name: string; description: string }) => {
    console.log("Guardando datos:", data);
    
    // Simulamos un retraso de red de 1 segundo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Actualizamos la tarjeta localmente para ver el resultado
    setDummySoftSkill((prev) => ({
      ...prev,
      name: data.name,
      description: data.description,
    }));

    // Cerramos el modal
    setIsModalOpen(false);
    setSkillToEdit(null);
  };

  return (
    <div className="min-h-screen bg-[#14162f] flex flex-col items-center justify-center p-10 font-heading">
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Playground: Soft Skills</h1>
        <p className="text-slate-400 text-sm">
          Pasa el cursor sobre la tarjeta para ver los botones de acción.
        </p>
      </div>

      {/* Contenedor que simula una columna del Grid */}
      <div className="w-full max-w-sm h-64">
        <SoftSkillCard 
          skill={dummySoftSkill} 
          onEdit={handleEditOpen} 
          onDelete={handleDelete} 
        />
      </div>

      {/* Consola visual de instrucciones */}
      <div className="mt-12 p-6 bg-[#13152e] border border-[#232555] rounded-xl text-slate-400 text-sm w-full max-w-md">
        <p className="text-white font-bold mb-2">Pruebas a realizar:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>Pasa el mouse: Los botones de lápiz y basura deben aparecer en la esquina superior derecha.</li>
          <li><b>Eliminar:</b> Haz clic en la basura y verifica que el AlertDialog aparezca con el formato oscuro.</li>
          <li><b>Editar:</b> Haz clic en el lápiz. El modal debe abrirse precargado con el nombre y descripción.</li>
          <li><b>Validación:</b> Modifica el texto y fíjate en el contador de caracteres (45 y 255).</li>
          <li><b>Guardar:</b> Haz clic en Guardar y observa el estado de carga antes de que se actualice la tarjeta.</li>
        </ul>
      </div>

      {/* Modal Inteligente montado a nivel de página */}
      <SoftSkillModal 
        isOpen={isModalOpen}
        skill={skillToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setSkillToEdit(null);
        }}
        onSave={handleSaveSkill}
      />

    </div>
  );
}
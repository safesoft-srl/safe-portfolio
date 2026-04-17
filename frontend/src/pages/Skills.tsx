import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AddTechnicalSkill } from "@/components/ui/addTechnicalSkill";

interface UserSkill {
  id: number;
  technical_skill_id: number; 
  name: string;
  category: string;
  level: string;
}

const API_URL = import.meta.env.VITE_API_URL;
const PORTFOLIO_ID = 1; 

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

const fetchUserSkills = async () => {
  try {
    const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}`);
    const result = await res.json();

   
    console.log("Datos del portafolio:", result);


    const skills = result.data?.technical_skills || result.technical_skills || [];
    
    setUserSkills(skills);
  } catch (err) {
    console.error("Error cargando skills del usuario:", err);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => { fetchUserSkills(); }, []);

const handleAddNewSkill = async (technical_skill_id: number, level: string) => {
  try {
    const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ technical_skill_id, level })
    });

    if (res.ok) {
      await fetchUserSkills(); 
    } else {
      const errorData = await res.json();
      console.error("Error de la API:", errorData.message);
    }
  } catch (err) {
    console.error("Error de conexión:", err);
  }
};

  const filteredSkills = userSkills.filter(skill => 
    activeCategory === "Todas" || skill.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#14162f] flex flex-col text-slate-100 font-heading">
      
      

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold text-white tracking-tight">Habilidades</h1>
          <div className="w-48">
             <AddTechnicalSkill onAdd={handleAddNewSkill} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {["Todas", "Frontend", "Backend", "DevOps", "Otros"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat 
                ? "bg-[#6c72ff] text-white border-[#6c72ff] shadow-[0_0_15px_rgba(108,114,255,0.3)]" 
                : "bg-[#1c1f38] text-slate-400 border-[#232555] hover:border-[#303464]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-500">Cargando habilidades...</div>
        ) : filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSkills.map((skill) => (
              <Card key={skill.technical_skill_id} className="bg-[#13152e] border border-[#232555] rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-[#6c72ff]/50">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-[#1c1f38] border border-[#232555] text-[#6c72ff] shadow-inner font-black text-2xl">
                    {skill.name.charAt(0)}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1">{skill.name}</h3>
                  <p className="text-slate-500 text-xs uppercase tracking-widest">{skill.category}</p>
                  <div className="mt-6 pt-4 border-t border-[#232555] w-full text-[#6c72ff] text-xs font-bold uppercase tracking-widest">
                    Nivel {skill.level}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#232555] rounded-3xl">
            <p className="text-slate-500 text-lg italic">No hay nada que mostrar</p>
            <p className="text-slate-600 text-sm mt-2">Empieza agregando una habilidad técnica a tu portafolio.</p>
          </div>
        )}
      </main>
    </div>
  );
}
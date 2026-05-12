import React, { useState, useMemo } from "react";
import { X, MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import type { Skill } from "@/services/skill.service";

interface SkillComboBoxProps {
  skills: Skill[];
  selected: Skill[];
  onChange: (selectedSkills: Skill[]) => void;
  placeholder?: string;
  label?: string;
}

export const SkillComboBox: React.FC<SkillComboBoxProps> = ({
  skills,
  selected,
  onChange,
  placeholder = "Selecciona habilidades...",
  label = "Habilidades",
}) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    const lower = (input || "").toLowerCase();

    return (skills || []).filter((s) => {
      const name = s?.name?.toLowerCase?.() || "";

      return name.includes(lower) && !selected.some((sel) => sel.id === s?.id);
    });
  }, [input, skills, selected]);

  const handleSelect = (skill: Skill) => {
    onChange([...selected, skill]);
    setInput("");
    setIsOpen(false);
  };

  const handleRemove = (id: number) => {
    onChange(selected.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-xs font-semibold text-slate-900 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative mb-2">
        <div className="relative flex items-center">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 text-[#8c91b7] pointer-events-none"
          />
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            placeholder={placeholder}
            className="h-10 w-full min-w-0 rounded-xl border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 pl-10 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {isOpen && filtered.length > 0 && (
          <ul
            className="absolute z-20 mt-1 w-full bg-input dark:bg-[#1f2552] border border-input dark:border-[#2a2d46] rounded-xl shadow-xl max-h-48 overflow-auto animate-in fade-in zoom-in-95"
            style={{
              scrollbarColor: "#23234a #181c2f",
              scrollbarWidth: "thin",
            }}
          >
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                background: #181c2f;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #23234a;
                border-radius: 8px;
              }
            `}</style>
            <div className="custom-scrollbar">
              {filtered.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer text-sm text-slate-900 dark:text-slate-200 hover:bg-[#f3f4f6] dark:hover:bg-[#23234a] transition-colors"
                  onMouseDown={() => handleSelect(skill)}
                >
                  {skill.urls.dark && (
                    <img src={skill.urls.dark} alt={skill.name} className="w-4 h-4 rounded-full" />
                  )}
                  {skill.name}
                </li>
              ))}
            </div>
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {selected.map((skill) => (
          <span
            key={skill.id}
            className="flex items-center gap-1 px-2 py-1 rounded-lg shadow-sm text-xs"
            style={{ background: "#6c72ff", color: "#fff" }}
          >
            {skill.urls.dark && (
              <img src={skill.urls.dark} alt={skill.name} className="w-4 h-4 rounded-full mr-1" />
            )}
            {skill.name}
            <button
              type="button"
              className="ml-1 rounded hover:bg-[#5c61eb] p-0.5"
              onClick={() => handleRemove(skill.id)}
              aria-label="Quitar habilidad"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

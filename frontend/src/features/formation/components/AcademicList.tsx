import AcademicCard from "./AcademicCard";

import type { AcademicRecord } from "../types/academic.types";

type Props = {
  academics: AcademicRecord[];
  onEdit: (academic: AcademicRecord) => void;
  onDelete: (academic: AcademicRecord) => void;
};

export default function AcademicList({ academics, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-6">
      {academics.map((academic) => (
        <AcademicCard
          key={academic.id}
          academic={academic}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

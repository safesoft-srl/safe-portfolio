import CourseCard from "./CourseCard";

import type { CourseRecord } from "../types/course.types";

type Props = {
  courses: CourseRecord[];
  onEdit: (course: CourseRecord) => void;
  onDelete: (course: CourseRecord) => void;
};

export default function CourseList({ courses, onEdit, onDelete }: Props) {
  return (
    <div className="mt-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

import { Problem, CATEGORIES } from "../App";
import { SectionCard } from "./section-card";

interface AllSectionsProps {
  problems: Problem[];
}

export function AllSections({ problems }: AllSectionsProps) {
  // Group problems by category
  const problemsByCategory = CATEGORIES.reduce((acc, category) => {
    acc[category] = problems.filter(p => p.category === category);
    return acc;
  }, {} as Record<string, Problem[]>);

  return (
    <div className="space-y-8">
      {CATEGORIES.map((category) => (
        <SectionCard
          key={category}
          category={category}
          problems={problemsByCategory[category]}
        />
      ))}
    </div>
  );
}

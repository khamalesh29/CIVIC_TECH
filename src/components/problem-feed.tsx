import { Problem } from "../App";
import { ProblemCard } from "./problem-card";

interface ProblemFeedProps {
  problems: Problem[];
}

export function ProblemFeed({ problems }: ProblemFeedProps) {
  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No issues reported in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}

import { Problem } from "../App";
import { ProblemCard } from "./problem-card";

interface CommunityFeedProps {
  problems: Problem[];
  currentUser: { name: string; email: string } | null;
  onDelete: (problemId: string) => void;
}

export function CommunityFeed({ problems, currentUser, onDelete }: CommunityFeedProps) {
  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No issues reported yet. Be the first to report!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      {problems.map((problem) => (
        <ProblemCard 
          key={problem.id} 
          problem={problem} 
          currentUser={currentUser}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
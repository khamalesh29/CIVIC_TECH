import { Problem } from "../App";
import { MapPin, Clock, Tag, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface ProblemCardProps {
  problem: Problem;
  currentUser: { name: string; email: string } | null;
  onDelete: (problemId: string) => void;
}

export function ProblemCard({ problem, currentUser, onDelete }: ProblemCardProps) {
  const timeAgo = getTimeAgo(new Date(problem.timestamp));
  const canDelete = problem.reportedBy === "You" || problem.reportedBy === currentUser?.name;

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">{problem.title}</h3>
            <p className="text-sm text-gray-500">{problem.reportedBy}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
              <Tag className="size-3" />
              {problem.category}
            </span>
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(problem.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                title="Delete report"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Media - Image or Video */}
        <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
          {problem.videoUrl ? (
            <video
              src={problem.videoUrl}
              controls
              className="w-full h-64 object-cover"
              poster={problem.imageUrl}
            />
          ) : (
            <img
              src={problem.imageUrl}
              alt={problem.title}
              className="w-full h-64 object-cover"
            />
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-3">
          {problem.description}
        </p>

        {/* Location - More Prominent */}
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2">
            <MapPin className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-orange-800">{problem.location}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}
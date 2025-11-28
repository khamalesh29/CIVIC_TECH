import { Problem } from "../App";
import { Card } from "./ui/card";
import { MapPin, Clock } from "lucide-react";
import { getCategoryIcon } from "../utils/category-icons";

interface SectionCardProps {
  category: string;
  problems: Problem[];
}

export function SectionCard({ category, problems }: SectionCardProps) {
  const Icon = getCategoryIcon(category);
  const recentProblems = problems.slice(0, 3);

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="size-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-gray-900">{category}</h2>
          <p className="text-sm text-gray-600">{problems.length} reported issues</p>
        </div>
      </div>

      {/* Problems Grid */}
      {recentProblems.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No issues reported in this category yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentProblems.map((problem) => (
            <Card key={problem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img
                  src={problem.imageUrl}
                  alt={problem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 line-clamp-1">{problem.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {problem.description}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="size-3" />
                    <span className="line-clamp-1">{problem.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="size-3" />
                    <span>{getTimeAgo(new Date(problem.timestamp))}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {problems.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:underline">
            View all {problems.length} issues in {category}
          </button>
        </div>
      )}
    </div>
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

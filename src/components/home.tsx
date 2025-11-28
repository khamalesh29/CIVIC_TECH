import { Problem } from "../App";
import { Feed } from "./feed";
import { Filter, ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

interface HomeProps {
  problems: Problem[];
  loading: boolean;
  currentUser: { name: string; email: string } | null;
  onDelete: (problemId: string) => void;
}

export function Home({ problems, loading, currentUser, onDelete }: HomeProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="bg-gray-100 px-6 py-6 text-center">
        <h2 className="text-blue-900 mb-1">Community Feed</h2>
        <p className="text-sm text-gray-600">Live reports from your neighbors</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="size-4" />
          Filters
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="size-4" />
          Newest First
        </Button>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto">
        <Feed problems={problems} currentUser={currentUser} onDelete={onDelete} />
      </div>
    </div>
  );
}
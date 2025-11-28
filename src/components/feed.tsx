import { Problem } from "../App";
import { CommunityFeed } from "./community-feed";

interface FeedProps {
  problems: Problem[];
  currentUser: { name: string; email: string } | null;
  onDelete: (problemId: string) => void;
}

export function Feed({ problems, currentUser, onDelete }: FeedProps) {
  return <CommunityFeed problems={problems} currentUser={currentUser} onDelete={onDelete} />;
}
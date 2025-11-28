import { User, Bell, MapPin, Info, LogOut } from "lucide-react";
import { Card } from "./ui/card";

interface AccountProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export function Account({ user, onLogout }: AccountProps) {
  return (
    <div className="px-4 py-6">
      <div className="mb-6 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
          <User className="size-10 text-blue-600" />
        </div>
        <h2 className="text-gray-900">{user?.name || 'Anonymous User'}</h2>
        <p className="text-sm text-gray-600">{user?.email || 'Community Member'}</p>
      </div>

      <div className="space-y-3">
        <Card className="p-4">
          <button className="w-full flex items-center gap-3 text-left">
            <Bell className="size-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-gray-900">Notifications</p>
              <p className="text-xs text-gray-500">Manage alert preferences</p>
            </div>
          </button>
        </Card>

        <Card className="p-4">
          <button className="w-full flex items-center gap-3 text-left">
            <MapPin className="size-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-gray-900">Location</p>
              <p className="text-xs text-gray-500">Set your default area</p>
            </div>
          </button>
        </Card>

        <Card className="p-4">
          <button className="w-full flex items-center gap-3 text-left">
            <Info className="size-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-gray-900">About</p>
              <p className="text-xs text-gray-500">Learn more about Civic Connect</p>
            </div>
          </button>
        </Card>

        <Card className="p-4">
          <button onClick={onLogout} className="w-full flex items-center gap-3 text-left text-red-600">
            <LogOut className="size-5" />
            <div className="flex-1">
              <p>Sign Out</p>
            </div>
          </button>
        </Card>
      </div>
    </div>
  );
}
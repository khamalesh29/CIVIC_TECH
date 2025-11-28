import { Car, Zap, PawPrint, Trash2, HelpCircle } from "lucide-react";

interface ReportIssueProps {
  onCategorySelect: (categoryId: string) => void;
}

export function ReportIssue({ onCategorySelect }: ReportIssueProps) {
  const categories = [
    { id: "roadways", label: "Roadways", icon: Car, color: "bg-amber-100 border-amber-200" },
    { id: "utility", label: "Utility/Power", icon: Zap, color: "bg-red-100 border-red-200" },
    { id: "animal", label: "Animal Control", icon: PawPrint, color: "bg-green-100 border-green-200" },
    { id: "sanitation", label: "Sanitation", icon: Trash2, color: "bg-blue-100 border-blue-200" },
    { id: "other", label: "Other", icon: HelpCircle, color: "bg-gray-100 border-gray-200" }
  ];

  return (
    <div className="px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-red-600 mb-2">Report an Issue</h2>
        <p className="text-gray-600">Choose the responsible department</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`${category.color} border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow min-h-[140px]`}
            >
              <Icon className="size-10 text-gray-700" strokeWidth={1.5} />
              <span className="text-gray-800">{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

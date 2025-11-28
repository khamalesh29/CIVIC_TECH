import { 
  Trash2, 
  Zap, 
  AlertTriangle, 
  Construction, 
  PawPrint, 
  MoreHorizontal 
} from "lucide-react";

export function getCategoryIcon(category: string) {
  switch (category) {
    case "Municipal Waste":
      return Trash2;
    case "Electricity":
      return Zap;
    case "Road Safety":
      return AlertTriangle;
    case "Potholes":
      return Construction;
    case "Animals":
      return PawPrint;
    case "Others":
      return MoreHorizontal;
    default:
      return MoreHorizontal;
  }
}

import { useState, useEffect } from "react";
import { Home } from "./components/home";
import { ReportIssue } from "./components/report-issue";
import { Feed } from "./components/feed";
import { Account } from "./components/account";
import { ReportProblem } from "./components/report-problem";
import { SignUp } from "./components/signup";
import { Login } from "./components/login";
import { Home as HomeIcon, AlertCircle, User } from "lucide-react";
import { projectId, publicAnonKey } from './utils/supabase/info.tsx';

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl: string;
  videoUrl?: string;
  timestamp: string;
  reportedBy: string;
}

export const CATEGORIES = [
  { id: "roadways", label: "Roadways", color: "bg-amber-100" },
  { id: "utility", label: "Utility/Power", color: "bg-red-100" },
  { id: "animal", label: "Animal Control", color: "bg-green-100" },
  { id: "sanitation", label: "Sanitation", color: "bg-blue-100" },
  { id: "other", label: "Other", color: "bg-gray-100" }
];

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-63fa048b`;

export default function App() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTab, setActiveTab] = useState("home");
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const fetchProblems = async () => {
    try {
      const response = await fetch(`${API_URL}/problems`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProblems(data.problems);
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleNewProblem = async (problem: Omit<Problem, "id" | "timestamp">) => {
    try {
      const response = await fetch(`${API_URL}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(problem)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProblems([data.problem, ...problems]);
        setShowReportModal(false);
        setSelectedCategory(null);
        setActiveTab("home");
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create problem:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowReportModal(true);
  };

  const handleSignUp = async (data: { name: string; email: string; password: string; phone: string }) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCurrentUser({ name: data.name, email: data.email });
        setIsAuthenticated(true);
        alert('Account created successfully!');
      } else {
        alert(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Failed to create account. Please try again.');
    }
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
      } else {
        alert(result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to log in. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab("home");
  };

  const handleDeleteProblem = async (problemId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/problems/${problemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProblems(problems.filter(p => p.id !== problemId));
      } else {
        alert('Failed to delete report. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete problem:', error);
      alert('Failed to delete report. Please try again.');
    }
  };

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    if (showLogin) {
      return <Login onLogin={handleLogin} onSwitchToSignUp={() => setShowLogin(false)} />;
    }
    return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => setShowLogin(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white border-b py-4 px-6 text-center">
        <h1 className="text-gray-800">CIVIC TECH</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === "home" && <Home problems={problems} loading={loading} currentUser={currentUser} onDelete={handleDeleteProblem} />}
        {activeTab === "report" && <ReportIssue onCategorySelect={handleCategorySelect} />}
        {activeTab === "account" && <Account user={currentUser} onLogout={handleLogout} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-6 py-2 ${
              activeTab === "home" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <HomeIcon className="size-6" />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab("report")}
            className={`flex flex-col items-center gap-1 px-6 py-2 ${
              activeTab === "report" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div className={`rounded-full p-2 ${activeTab === "report" ? "bg-blue-600" : "bg-gray-200"}`}>
              <AlertCircle className={`size-5 ${activeTab === "report" ? "text-white" : "text-gray-400"}`} />
            </div>
            <span className="text-xs">Report</span>
          </button>
          
          <button
            onClick={() => setActiveTab("account")}
            className={`flex flex-col items-center gap-1 px-6 py-2 ${
              activeTab === "account" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <User className="size-6" />
            <span className="text-xs">Account</span>
          </button>
        </div>
      </nav>

      {/* Report Modal */}
      {showReportModal && selectedCategory && (
        <ReportProblem
          onClose={() => {
            setShowReportModal(false);
            setSelectedCategory(null);
          }}
          onSubmit={handleNewProblem}
          preselectedCategory={selectedCategory}
        />
      )}
    </div>
  );
}
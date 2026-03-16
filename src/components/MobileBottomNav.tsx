"use client";

import { useSession } from "next-auth/react";
import { ViewMode } from "@/lib/types";
import {
  LayoutDashboard,
  FileText,
  Grid3X3,
  Shield,
  Users,
  User,
  DollarSign,
} from "lucide-react";

interface Props {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

const MOBILE_NAV: { id: ViewMode; label: string; icon: React.ReactNode; roles: string[] }[] = [
  { id: "dashboard", label: "Home", icon: <LayoutDashboard size={20} />, roles: ["ADMIN", "TRAINER"] },
  { id: "evidence-list", label: "Evidence", icon: <FileText size={20} />, roles: ["ADMIN", "TRAINER", "STUDENT"] },
  { id: "coverage-map", label: "Map", icon: <Grid3X3 size={20} />, roles: ["ADMIN", "TRAINER"] },
  { id: "assessor-panel", label: "Assessor", icon: <Shield size={20} />, roles: ["ADMIN", "TRAINER"] },
  { id: "students", label: "Students", icon: <Users size={20} />, roles: ["ADMIN", "TRAINER"] },
  { id: "my-portal", label: "My Portal", icon: <User size={20} />, roles: ["STUDENT"] },
];

export default function MobileBottomNav({ currentView, onNavigate }: Props) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "TRAINER";
  const items = MOBILE_NAV.filter((i) => i.roles.includes(role));

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-primary/95 backdrop-blur border-t border-surface-border safe-area-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {items.map((item) => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

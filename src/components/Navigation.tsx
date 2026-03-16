"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { ViewMode } from "@/lib/types";
import {
  LayoutDashboard,
  FileText,
  Grid3X3,
  ClipboardCheck,
  Shield,
  AlertTriangle,
  Users,
  Clock,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";

interface Props {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  stats: { coveragePercent: number };
}

const ALL_NAV_ITEMS: {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, roles: ["ADMIN", "TRAINER"] },
  { id: "evidence-list", label: "Evidence List", icon: <FileText size={18} />, roles: ["ADMIN", "TRAINER", "STUDENT"] },
  { id: "coverage-map", label: "Coverage Map", icon: <Grid3X3 size={18} />, roles: ["ADMIN", "TRAINER"] },
  { id: "student-checklist", label: "Student Checklist", icon: <ClipboardCheck size={18} />, roles: ["ADMIN", "TRAINER", "STUDENT"] },
  { id: "assessor-panel", label: "Assessor Panel", icon: <Shield size={18} />, roles: ["ADMIN", "TRAINER"] },
  { id: "gap-analysis", label: "Gap Analysis", icon: <AlertTriangle size={18} />, roles: ["ADMIN", "TRAINER"] },
  { id: "students", label: "Students", icon: <Users size={18} />, roles: ["ADMIN", "TRAINER"] },
  { id: "my-portal", label: "My Portal", icon: <User size={18} />, roles: ["STUDENT"] },
];

function BrisbaneClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Intl.DateTimeFormat("en-AU", {
        timeZone: "Australia/Brisbane",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
      setTime(now);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono text-muted">
      <Clock size={12} className="text-accent" />
      <span>{time || "--:--:--"}</span>
      <span className="text-accent/60">AEST</span>
    </div>
  );
}

export default function Navigation({ currentView, onNavigate, stats }: Props) {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userRole = session?.user?.role ?? "TRAINER";
  const navItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur border-b border-surface-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img src="/logo.png" alt="Prepare Training" className="w-9 h-9 object-contain" />
            <div className="hidden sm:flex flex-col">
              <h1 className="font-display text-lg font-bold tracking-widest text-white leading-tight uppercase">
                Prepare Training
              </h1>
              <p className="font-cursive text-yellow-400 text-[11px] leading-tight">
                Failing To Prepare, Is Preparing To Fail
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold tracking-wide transition-all ${
                  currentView === item.id
                    ? "text-accent bg-accent/10 border border-accent/30"
                    : "text-muted hover:text-white hover:bg-surface-light border border-transparent"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <BrisbaneClock />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1.5 bg-surface-light overflow-hidden">
                <div
                  className="h-full bg-accent progress-fill"
                  style={{ width: `${stats.coveragePercent}%` }}
                />
              </div>
              <span className="text-xs font-mono text-accent">{stats.coveragePercent}%</span>
            </div>

            {/* User info + logout */}
            {session?.user && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <User size={12} />
                  <span className="font-medium text-white">{session.user.name}</span>
                  <span className="text-accent/60 uppercase text-[10px]">{session.user.role}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="p-1.5 text-muted hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-muted hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-3 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${
                  currentView === item.id
                    ? "text-accent bg-accent/10"
                    : "text-muted hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            {session?.user && (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Sign Out ({session.user.name})
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

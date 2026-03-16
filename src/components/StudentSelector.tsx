"use client";

import { useState, useEffect, useRef } from "react";
import { Users, ChevronDown, Search, X } from "lucide-react";

interface Student {
  id: string;
  name: string;
  qualification: string;
}

interface Props {
  selected: Student | null;
  onSelect: (student: Student | null) => void;
}

export default function StudentSelector({ selected, onSelect }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => setStudents(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!selected) {
    return (
      <div className="py-6">
        <div ref={ref} className="relative max-w-md">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-surface border border-accent/40 text-left hover:border-accent transition-colors"
          >
            <Users size={18} className="text-accent" />
            <span className="text-muted flex-1">Select a student to begin...</span>
            <ChevronDown size={16} className="text-muted" />
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-surface-border z-40 shadow-xl max-h-64 overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-surface-border">
                <Search size={14} className="text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-muted"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted">No students found</div>
                ) : (
                  filtered.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelect(s);
                        setOpen(false);
                        setSearch("");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-light transition-colors flex items-center justify-between"
                    >
                      <span className="text-white font-medium">{s.name}</span>
                      <span className="text-xs text-muted font-mono">{s.qualification}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/30">
        <Users size={16} className="text-accent" />
        <span className="text-sm text-white font-medium">{selected.name}</span>
        <span className="text-xs font-mono text-accent">{selected.qualification}</span>
        <button
          onClick={() => onSelect(null)}
          className="ml-2 text-muted hover:text-white transition-colors"
          title="Change student"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

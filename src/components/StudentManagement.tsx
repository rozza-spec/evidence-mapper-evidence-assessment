"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import CsvImport from "@/components/CsvImport";
import { QUALIFICATIONS } from "@/lib/data";
import {
  Users,
  Plus,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Upload,
  FileText,
  FileSpreadsheet,
  Trash2,
  X,
  Search,
  GraduationCap,
} from "lucide-react";
import { ExportPaymentStatement } from "@/components/ExportButtons";

interface Payment {
  id: string;
  amount: number;
  invoiceFilename: string | null;
  invoicePath: string | null;
  note: string | null;
  createdAt: string;
}

interface Enrolment {
  id: string;
  qualificationId: string;
  status: string;
  enrolledAt: string;
}

interface Student {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  qualification: string;
  totalOwing: number;
  totalPaid: number;
  balance: number;
  createdAt: string;
  payments: Payment[];
  enrolments?: Enrolment[];
}

const QUAL_OPTIONS = QUALIFICATIONS.map((q) => ({
  value: q.code,
  label: `${q.code} — ${q.level}`,
}));

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchStudents = useCallback(async () => {
    const res = await fetch("/api/students");
    if (res.ok) setStudents(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const filtered = search
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.qualification.toLowerCase().includes(search.toLowerCase())
      )
    : students;

  return (
    <div className="py-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-accent" />
          <div>
            <h2 className="font-display text-4xl font-bold tracking-wide text-white">
              STUDENT MANAGEMENT
            </h2>
            <p className="text-muted text-base mt-1">
              Enrol students, track qualifications and manage payments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowCsvImport(!showCsvImport); setShowForm(false); }}
            className="flex items-center gap-2 bg-surface-light text-muted border border-surface-border px-3 py-2 text-sm hover:text-white transition-colors"
          >
            <FileSpreadsheet size={16} />
            <span className="hidden sm:inline">CSV Import</span>
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setShowCsvImport(false); }}
            className="flex items-center gap-2 bg-accent text-primary px-4 py-2 font-semibold text-sm hover:bg-accent/90 transition-colors"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add Student"}
          </button>
        </div>
      </div>

      {showCsvImport && (
        <CsvImport onComplete={() => { setShowCsvImport(false); fetchStudents(); }} />
      )}

      {showForm && (
        <AddStudentForm
          onCreated={() => { setShowForm(false); fetchStudents(); }}
        />
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-surface-border text-base text-white pl-10 pr-3 py-2 focus:outline-none focus:border-accent placeholder:text-muted/50"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Total Students" value={students.length} />
        <SummaryCard
          label="Total Owing"
          value={formatCurrency(students.reduce((s, st) => s + st.totalOwing, 0))}
          accent
        />
        <SummaryCard
          label="Total Paid"
          value={formatCurrency(students.reduce((s, st) => s + st.totalPaid, 0))}
          accent
        />
        <SummaryCard
          label="Outstanding Balance"
          value={formatCurrency(students.reduce((s, st) => s + st.balance, 0))}
          warn={students.some((s) => s.balance > 0)}
        />
      </div>

      {/* Student List */}
      {loading ? (
        <p className="text-muted text-base">Loading students...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-surface-border p-8 text-center">
          <Users size={32} className="text-muted mx-auto mb-3" />
          <p className="text-base text-muted">
            {search ? "No students match your search." : "No students enrolled yet. Click \"Add Student\" to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              isExpanded={expandedId === student.id}
              onToggle={() => setExpandedId(expandedId === student.id ? null : student.id)}
              onRefresh={fetchStudents}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddStudentForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState(QUAL_OPTIONS[0].value);
  const [totalOwing, setTotalOwing] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Student name is required"); return; }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email, phone, qualification, totalOwing: Number(totalOwing) || 0 }),
    });

    if (res.ok) {
      toast.success(`${name.trim()} enrolled successfully`);
      onCreated();
    } else {
      const data = await res.json();
      const msg = data.error || "Failed to create student";
      setError(msg);
      toast.error(msg);
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-accent/30 p-6 space-y-4 animate-fade-in">
      <h3 className="font-display text-xl font-bold text-white">NEW STUDENT ENROLMENT</h3>
      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2">{error}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Full Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full bg-surface-light border border-surface-border text-base text-white px-3 py-2 focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Qualification *</label>
          <select value={qualification} onChange={(e) => setQualification(e.target.value)}
            className="w-full bg-surface-light border border-surface-border text-base text-white px-3 py-2 focus:outline-none focus:border-accent">
            {QUAL_OPTIONS.map((q) => <option key={q.value} value={q.value}>{q.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-light border border-surface-border text-base text-white px-3 py-2 focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-surface-light border border-surface-border text-base text-white px-3 py-2 focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Total Amount Owing ($)</label>
          <input type="number" min="0" step="0.01" value={totalOwing} onChange={(e) => setTotalOwing(e.target.value)}
            placeholder="e.g. 7000"
            className="w-full bg-surface-light border border-surface-border text-base text-white px-3 py-2 focus:outline-none focus:border-accent placeholder:text-muted/50" />
        </div>
      </div>
      <button type="submit" disabled={submitting}
        className="bg-accent text-primary px-6 py-2 font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50">
        {submitting ? "Creating..." : "Create Student"}
      </button>
    </form>
  );
}

function StudentCard({
  student,
  isExpanded,
  onToggle,
  onRefresh,
}: {
  student: Student;
  isExpanded: boolean;
  onToggle: () => void;
  onRefresh: () => void;
}) {
  const paidPercent = student.totalOwing > 0
    ? Math.min(100, Math.round((student.totalPaid / student.totalOwing) * 100))
    : 0;
  const qual = QUALIFICATIONS.find((q) => q.code === student.qualification);

  return (
    <div className={`bg-surface border transition-all ${student.balance <= 0 ? "border-accent/30" : "border-surface-border"}`}>
      <button onClick={onToggle} className="w-full text-left p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-accent text-lg">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-base text-white">{student.name}</h4>
            <p className="text-sm text-muted">
              {qual?.level ?? student.qualification}
              {student.email && <span className="ml-2 text-muted/60">· {student.email}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className={`font-display text-lg font-bold ${student.balance > 0 ? "text-red-400" : "text-accent"}`}>
              {formatCurrency(student.balance)}
            </div>
            <div className="text-xs text-muted">balance owing</div>
          </div>
          <div className="w-16 h-2 bg-surface-light overflow-hidden hidden sm:block">
            <div className="h-full bg-accent" style={{ width: `${paidPercent}%` }} />
          </div>
          {isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
        </div>
      </button>

      {isExpanded && (
        <StudentDetail student={student} onRefresh={onRefresh} />
      )}
    </div>
  );
}

function StudentDetail({ student, onRefresh }: { student: Student; onRefresh: () => void }) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    setConfirmDelete(false);
    setDeleting(true);
    await fetch(`/api/students/${student.id}`, { method: "DELETE" });
    toast.success(`${student.name} deleted`);
    onRefresh();
  }

  return (
    <div className="border-t border-surface-border px-4 pb-4 pt-3 space-y-4 animate-fade-in">
      {/* Balance overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-light border border-surface-border p-3 text-center">
          <div className="font-display text-xl font-bold text-white">{formatCurrency(student.totalOwing)}</div>
          <div className="text-sm text-muted">Total Owing</div>
        </div>
        <div className="bg-accent/10 border border-accent/30 p-3 text-center">
          <div className="font-display text-xl font-bold text-accent">{formatCurrency(student.totalPaid)}</div>
          <div className="text-sm text-accent">Amount Paid</div>
        </div>
        <div className={`border p-3 text-center ${student.balance > 0 ? "bg-red-500/10 border-red-500/30" : "bg-accent/10 border-accent/30"}`}>
          <div className={`font-display text-xl font-bold ${student.balance > 0 ? "text-red-400" : "text-accent"}`}>
            {formatCurrency(student.balance)}
          </div>
          <div className={`text-sm ${student.balance > 0 ? "text-red-400" : "text-accent"}`}>
            {student.balance <= 0 ? "Paid in Full" : "Remaining"}
          </div>
        </div>
      </div>

      {/* Balance bar */}
      {student.totalOwing > 0 && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted">Payment Progress</span>
            <span className="text-accent font-mono">
              {Math.min(100, Math.round((student.totalPaid / student.totalOwing) * 100))}%
            </span>
          </div>
          <div className="w-full h-3 bg-surface-light overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-dark to-accent progress-fill"
              style={{ width: `${Math.min(100, (student.totalPaid / student.totalOwing) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Contact info */}
      {(student.email || student.phone) && (
        <div className="flex gap-4 text-sm text-muted">
          {student.email && <span>Email: <span className="text-white">{student.email}</span></span>}
          {student.phone && <span>Phone: <span className="text-white">{student.phone}</span></span>}
        </div>
      )}

      {/* Enrolments */}
      <EnrolmentSection student={student} onRefresh={onRefresh} />

      {/* Payment history */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign size={14} className="text-accent" />
            Payment History ({student.payments.length})
          </h5>
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
          >
            {showPaymentForm ? <X size={14} /> : <Plus size={14} />}
            {showPaymentForm ? "Cancel" : "Add Payment"}
          </button>
        </div>

        {showPaymentForm && (
          <AddPaymentForm
            studentId={student.id}
            onCreated={() => { setShowPaymentForm(false); onRefresh(); }}
          />
        )}

        {student.payments.length === 0 ? (
          <p className="text-sm text-muted italic">No payments recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {student.payments.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-surface-light border border-surface-border p-3">
                <DollarSign size={14} className="text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-accent">{formatCurrency(p.amount)}</span>
                  {p.note && <span className="text-sm text-muted ml-2">— {p.note}</span>}
                </div>
                {p.invoicePath && (
                  <a href={p.invoicePath} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-accent hover:underline shrink-0">
                    <FileText size={12} /> {p.invoiceFilename || "Invoice"}
                  </a>
                )}
                <span className="text-xs text-muted shrink-0">{formatDate(p.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-border">
        <ExportPaymentStatement
          studentName={student.name}
          qualification={student.qualification}
          totalOwing={student.totalOwing}
          totalPaid={student.totalPaid}
          balance={student.balance}
          payments={student.payments}
        />
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={deleting}
          className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          <Trash2 size={14} />
          {deleting ? "Deleting..." : "Delete Student"}
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Student"
        message={`Permanently delete ${student.name}? This removes all their payment records, evidence, and competency data.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function AddPaymentForm({ studentId, onCreated }: { studentId: string; onCreated: () => void }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) { setError("Enter a valid payment amount"); return; }
    setSubmitting(true);
    setError("");

    const form = new FormData();
    form.append("amount", String(num));
    if (note) form.append("note", note);
    if (file) form.append("invoice", file);

    const res = await fetch(`/api/students/${studentId}/payments`, { method: "POST", body: form });
    if (res.ok) {
      toast.success(`Payment of $${num.toFixed(2)} recorded`);
      onCreated();
    } else {
      const data = await res.json();
      const msg = data.error || "Failed to record payment";
      setError(msg);
      toast.error(msg);
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-accent/20 p-4 mb-3 space-y-3 animate-fade-in">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Amount ($) *</label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required
            placeholder="e.g. 3300"
            className="w-full bg-surface-light border border-surface-border text-base text-white px-3 py-2 focus:outline-none focus:border-accent placeholder:text-muted/50" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Note</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. First instalment"
            className="w-full bg-surface-light border border-surface-border text-base text-white px-3 py-2 focus:outline-none focus:border-accent placeholder:text-muted/50" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Invoice (PDF/image)</label>
          <label className="flex items-center gap-2 cursor-pointer bg-surface-light border border-surface-border text-sm text-muted px-3 py-2 hover:border-accent transition-colors">
            <Upload size={14} />
            <span className="truncate">{file ? file.name : "Choose file..."}</span>
            <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
      </div>
      <button type="submit" disabled={submitting}
        className="bg-accent text-primary px-4 py-2 font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50">
        {submitting ? "Recording..." : "Record Payment"}
      </button>
    </form>
  );
}

function EnrolmentSection({ student, onRefresh }: { student: Student; onRefresh: () => void }) {
  const [adding, setAdding] = useState(false);
  const [newQual, setNewQual] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const enrolments = student.enrolments ?? [];
  const enrolledIds = new Set(enrolments.map((e) => e.qualificationId));
  // Always include the primary qualification
  enrolledIds.add(student.qualification);
  const availableQuals = QUAL_OPTIONS.filter((q) => !enrolledIds.has(q.value));

  async function handleAdd() {
    if (!newQual) return;
    setSubmitting(true);
    const res = await fetch(`/api/students/${student.id}/enrolments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qualificationId: newQual }),
    });
    if (res.ok) {
      toast.success("Qualification added");
      setAdding(false);
      setNewQual("");
      onRefresh();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to add qualification");
    }
    setSubmitting(false);
  }

  async function handleRemove(enrolmentId: string, qualId: string) {
    const res = await fetch(`/api/students/${student.id}/enrolments?enrolmentId=${enrolmentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success(`Removed ${qualId}`);
      onRefresh();
    } else {
      toast.error("Failed to remove qualification");
    }
  }

  const allEnrolled = [
    { id: "primary", qualificationId: student.qualification, status: "active", isPrimary: true },
    ...enrolments.filter((e) => e.qualificationId !== student.qualification).map((e) => ({ ...e, isPrimary: false })),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-sm font-bold text-white flex items-center gap-2">
          <GraduationCap size={14} className="text-accent" />
          Qualifications ({allEnrolled.length})
        </h5>
        {availableQuals.length > 0 && (
          <button
            onClick={() => setAdding(!adding)}
            className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
          >
            {adding ? <X size={14} /> : <Plus size={14} />}
            {adding ? "Cancel" : "Add Qualification"}
          </button>
        )}
      </div>

      {adding && (
        <div className="flex items-center gap-2 mb-2 animate-fade-in">
          <select
            value={newQual}
            onChange={(e) => setNewQual(e.target.value)}
            className="flex-1 bg-surface-light border border-surface-border text-sm text-white px-3 py-2 focus:outline-none focus:border-accent"
          >
            <option value="">Select qualification...</option>
            {availableQuals.map((q) => (
              <option key={q.value} value={q.value}>{q.label}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!newQual || submitting}
            className="bg-accent text-primary px-3 py-2 font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>
      )}

      <div className="space-y-1">
        {allEnrolled.map((e) => {
          const qual = QUALIFICATIONS.find((q) => q.code === e.qualificationId);
          return (
            <div key={e.id} className="flex items-center justify-between bg-surface-light border border-surface-border px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-accent">{e.qualificationId}</span>
                <span className="text-sm text-white">{qual?.level ?? ""}</span>
                {e.isPrimary && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-accent/20 text-accent font-semibold">PRIMARY</span>
                )}
              </div>
              {!e.isPrimary && (
                <button
                  onClick={() => handleRemove(e.id, e.qualificationId)}
                  className="text-muted hover:text-red-400 transition-colors"
                  title="Remove qualification"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent, warn }: { label: string; value: string | number; accent?: boolean; warn?: boolean }) {
  return (
    <div className={`bg-surface border p-4 ${warn ? "border-red-500/30" : "border-surface-border"}`}>
      <div className={`font-display text-2xl font-bold ${accent ? "text-accent" : warn ? "text-red-400" : "text-white"}`}>
        {value}
      </div>
      <div className="text-sm text-muted mt-0.5">{label}</div>
    </div>
  );
}

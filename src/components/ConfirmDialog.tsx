"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "danger",
  onConfirm,
  onCancel,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;

  const isDanger = variant === "danger";
  const btnClass = isDanger
    ? "bg-red-600 hover:bg-red-500 text-white"
    : "bg-yellow-600 hover:bg-yellow-500 text-white";

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="backdrop:bg-black/60 bg-transparent p-0 m-auto"
    >
      <div className="bg-surface border border-surface-border p-6 w-[90vw] max-w-md space-y-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className={isDanger ? "text-red-400" : "text-yellow-400"} />
            <h3 className="font-display text-lg font-bold text-white">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-muted hover:text-white">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-muted leading-relaxed">{message}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-muted hover:text-white bg-surface-light border border-surface-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium transition-colors ${btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

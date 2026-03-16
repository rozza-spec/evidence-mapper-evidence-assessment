const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// PDF magic bytes: %PDF (hex 25 50 44 46)
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePdfUpload(file: File, bytes: Uint8Array): FileValidationResult {
  if (file.size === 0) {
    return { valid: false, error: "File is empty" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File exceeds 10MB limit" };
  }

  // Verify magic bytes — don't trust the MIME type from the client
  if (bytes.length < 4) {
    return { valid: false, error: "File is too small to be a valid PDF" };
  }

  const isPdf = PDF_MAGIC.every((b, i) => bytes[i] === b);
  if (!isPdf) {
    return { valid: false, error: "File is not a valid PDF (magic bytes mismatch)" };
  }

  return { valid: true };
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
}

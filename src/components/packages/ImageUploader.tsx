"use client";

import { useRef, useState } from "react";
import { FaUpload, FaXmark, FaSpinner } from "react-icons/fa6";
import type { ApiResponse } from "@/types";

interface UploadSignature {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ value, onChange, maxImages = 8 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadToCloudinary(file: File, sig: UploadSignature): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Cloudinary upload failed.");
    }

    const data = await res.json();
    return data.secure_url as string;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      setError(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    const selected = Array.from(files).slice(0, remainingSlots);

    setUploading(true);
    try {
      // One signature (timestamp + folder) authorizes this whole batch —
      // no need to re-sign per file since the signed params don't change.
      const sigRes = await fetch("/api/upload", { method: "POST" });
      const sigJson: ApiResponse<UploadSignature> = await sigRes.json();

      if (!sigRes.ok || !sigJson.success || !sigJson.data) {
        throw new Error(sigJson.message || "Could not get upload permission. Please log in and try again.");
      }

      const uploadedUrls = await Promise.all(selected.map((file) => uploadToCloudinary(file, sigJson.data!)));

      onChange([...value, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-neutral-800">
        Images <span className="text-neutral-400 font-normal">(at least 1 required)</span>
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {value.map((url, index) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary URL preview, next/image adds no value here */}
            <img src={url} alt={`Package image ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              aria-label="Remove image"
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <FaXmark size={12} />
            </button>
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-1 text-neutral-500 hover:border-teal hover:text-teal transition-colors disabled:opacity-60"
          >
            {uploading ? <FaSpinner className="animate-spin" size={18} /> : <FaUpload size={18} />}
            <span className="text-xs">{uploading ? "Uploading…" : "Add photo"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

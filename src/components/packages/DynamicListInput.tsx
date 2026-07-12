"use client";

import { useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6";

interface DynamicListInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  helperText?: string;
}

export default function DynamicListInput({
  label,
  values,
  onChange,
  placeholder,
  helperText,
}: DynamicListInputProps) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setDraft("");
  }

  function removeItem(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-neutral-800">{label}</label>
      {helperText && <p className="text-xs text-neutral-500 mb-2">{helperText}</p>}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded-xl bg-teal px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <FaPlus size={12} /> Add
        </button>
      </div>

      {values.length > 0 && (
        <ul className="mt-3 space-y-2">
          {values.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-center justify-between rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-700"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label={`Remove ${item}`}
                className="text-neutral-400 hover:text-red-500"
              >
                <FaXmark size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

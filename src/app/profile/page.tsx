"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPen, FaCheck, FaXmark, FaBoxOpen, FaCalendarCheck } from "react-icons/fa6";
import { toast } from "@heroui/react";
import { useSession, signOut, authClient } from "@/lib/auth-client";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (isPending) {
    return <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse h-40 rounded-2xl bg-neutral-100" />;
  }

  if (!session) {
    // proxy.ts already redirects logged-out visitors to /login; this is just a safe fallback.
    return null;
  }

  const { user } = session;

  function startEditing() {
    setNameInput(user.name);
    setIsEditing(true);
  }

  async function saveName() {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      toast.danger("Name can't be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({ name: trimmed });
      if (error) {
        toast.danger(error.message || "Failed to update name.");
        return;
      }
      toast.success("Profile updated.");
      setIsEditing(false);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">My Profile</h1>

      <div className="rounded-2xl border border-neutral-200 p-6">
        <div className="flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-provided avatar URL, next/image adds no value here
            <img src={user.image} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal text-xl font-semibold">
              {initials(user.name) || "?"}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  autoFocus
                  className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm font-semibold text-neutral-900"
                />
                <button
                  type="button"
                  onClick={saveName}
                  disabled={isSaving}
                  aria-label="Save"
                  className="text-teal hover:opacity-80 disabled:opacity-50"
                >
                  <FaCheck size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  aria-label="Cancel"
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <FaXmark size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-neutral-900 text-lg truncate">{user.name}</h2>
                <button
                  type="button"
                  onClick={startEditing}
                  aria-label="Edit name"
                  className="text-neutral-400 hover:text-teal"
                >
                  <FaPen size={12} />
                </button>
              </div>
            )}
            <p className="text-sm text-neutral-500 truncate">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-wrap gap-3">
          <Link
            href="/items/manage"
            className="flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <FaBoxOpen size={13} /> Manage My Packages
          </Link>
          <Link
            href="/bookings"
            className="flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <FaCalendarCheck size={13} /> My Bookings
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 rounded-xl bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100"
      >
        Log Out
      </button>
    </div>
  );
}

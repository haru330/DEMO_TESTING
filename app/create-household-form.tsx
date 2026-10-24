"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function CreateHouseholdForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const displayName = String(new FormData(event.currentTarget).get("displayName") ?? "");
    try {
      const res = await fetch("/api/households", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      if (!res.ok) {
        setError((await res.json()).error ?? "Something went wrong");
        return;
      }
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-base font-medium">
        Your name
        <input
          name="displayName"
          required
          maxLength={40}
          autoComplete="given-name"
          className="rounded-lg border border-current/30 bg-transparent px-3 py-3 text-base font-normal"
        />
      </label>
      {error && (
        <p role="alert" className="text-base text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#2f7d4f] px-4 py-3 text-base font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create our Household"}
      </button>
    </form>
  );
}

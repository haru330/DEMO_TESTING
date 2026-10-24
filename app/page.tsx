import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { memberForToken, SESSION_COOKIE } from "@/lib/session";
import { CreateHouseholdForm } from "./create-household-form";

export default function Home() {
  return (
    <Suspense fallback={<main className="flex-1" aria-busy="true" />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? null;
  const current = await memberForToken(await getDb(), token);

  if (!current) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="max-w-sm text-center">
          <h1 className="text-3xl font-semibold">Pantry</h1>
          <p className="mt-2 text-base opacity-80">
            Keep track of the food at home and get recipes from what you have.
          </p>
        </div>
        <CreateHouseholdForm />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Pantry</h1>
        <p className="text-base opacity-80">Signed in as {current.member.displayName}</p>
      </header>
      <section
        aria-label="Pantry"
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-current/30 p-6 text-center"
      >
        <p className="text-base opacity-80">Your Pantry is empty. Items you add will show up here.</p>
      </section>
    </main>
  );
}

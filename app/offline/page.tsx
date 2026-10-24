export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="max-w-sm text-base opacity-80">
        Pantry needs a connection to show and change your food. Check your signal and try again.
      </p>
    </main>
  );
}

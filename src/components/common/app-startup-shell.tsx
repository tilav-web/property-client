export default function AppStartupShell() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="border-b border-slate-200">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <div className="text-base font-semibold tracking-tight">
            Amaar Properties
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-14 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-14 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-14 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-4 py-6 md:py-8">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-lg bg-slate-900">
            <div className="h-[300px] w-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] md:h-[450px]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <div className="h-10 w-full max-w-xl animate-pulse rounded bg-white/30 md:h-14" />
              <div className="h-14 w-full max-w-2xl animate-pulse rounded-lg bg-white/85" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-10 px-4 py-8">
        <div className="mx-auto h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] animate-pulse rounded-lg bg-slate-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

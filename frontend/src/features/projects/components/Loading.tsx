export default function Loading() {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl items-center justify-center font-sans text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6c72ff] border-t-transparent" />
          <span className="text-sm text-slate-700 dark:text-slate-200">Cargando...</span>
        </div>
      </div>
    );
}
export default function AddPackagePlaceholder() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold">Add Package (placeholder)</h1>
      <p className="text-slate-500 mt-2">
        This route is protected by middleware. Reaching this page means you are logged in.
        The real form is built in Phase 5.
      </p>
    </div>
  );
}

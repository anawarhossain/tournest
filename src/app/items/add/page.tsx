import PackageForm from "@/components/packages/PackageForm";

export default function AddPackagePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Add a New Package</h1>
      <p className="text-neutral-500 text-sm mt-1 mb-8">
        Fill in the details below to publish a new tour package.
      </p>

      <PackageForm mode="create" />
    </div>
  );
}

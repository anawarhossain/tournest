import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Package } from "@/models/Package";
import { getServerSession } from "@/lib/get-server-session";
import PackageForm from "@/components/packages/PackageForm";

interface EditPackagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    notFound();
  }

  // proxy.ts already ensures the visitor is logged in (cookie-presence check).
  // Full session verification + ownership check happens here, server-side.
  const session = await getServerSession();
  if (!session) {
    redirect(`/login?returnUrl=/items/edit/${id}`);
  }

  await connectDB();
  const pkg = await Package.findById(id).lean();

  if (!pkg) {
    notFound();
  }

  if (pkg.ownerId.toString() !== session.user.id) {
    // Requirements §2: never let a non-owner reach the edit form, even by direct URL.
    redirect("/items/manage");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Edit Package</h1>
      <p className="text-neutral-500 text-sm mt-1 mb-8">Update the details of &quot;{pkg.title}&quot;.</p>

      <PackageForm
        mode="edit"
        packageId={id}
        defaultValues={{
          title: pkg.title,
          shortDescription: pkg.shortDescription,
          fullDescription: pkg.fullDescription,
          price: pkg.price,
          location: pkg.location,
          departureDate: new Date(pkg.departureDate).toISOString().slice(0, 10),
          duration: pkg.duration,
          category: pkg.category,
          images: pkg.images,
          specifications: pkg.specifications,
        }}
      />
    </div>
  );
}

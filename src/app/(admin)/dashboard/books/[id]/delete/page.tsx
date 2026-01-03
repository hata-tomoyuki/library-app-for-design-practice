import { findBookById } from "@/app/actions/bookActions";
import DeleteBookModal from "@/app/components/DeleteBookModal";
import { notFound } from "next/navigation";

export default async function DeletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await findBookById(id).catch(() => null);
  if (!book) notFound();
  return <DeleteBookModal book={book} />;
}

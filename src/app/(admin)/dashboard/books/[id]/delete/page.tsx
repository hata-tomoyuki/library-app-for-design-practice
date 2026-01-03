import { findBookById } from "@/app/actions/bookActions";
import { notFound } from "next/navigation";
import DeleteBookModal from "./_components/DeleteBookModal";

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

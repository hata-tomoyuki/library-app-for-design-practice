import { findBookById } from "@/app/actions/bookActions";
import { notFound } from "next/navigation";
import UpdateBookModal from "./_components/UpdateBookModal";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await findBookById(id).catch(() => null);
  if (!book) notFound();
  return <UpdateBookModal book={book} />;
}

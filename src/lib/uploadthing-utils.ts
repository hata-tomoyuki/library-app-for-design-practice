import { UTApi } from "uploadthing/server";

/**
 * UploadThingのURLからファイルキーを抽出
 * @param url UploadThingのURL（例: https://utfs.io/f/{fileKey}）
 * @returns ファイルキー、抽出できない場合はnull
 */
export function extractFileKeyFromUrl(url: string): string | null {
  try {
    // UploadThingのURL形式: https://utfs.io/f/{fileKey} または https://uploadthing.com/f/{fileKey}
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const fileKey = pathParts[pathParts.length - 1];
    return fileKey || null;
  } catch {
    return null;
  }
}

/**
 * UploadThingからファイルを削除
 * @param fileKey 削除するファイルのキー
 * @returns 削除に成功した場合はtrue、失敗した場合はfalse
 */
export async function deleteFileFromUploadThing(
  fileKey: string,
): Promise<boolean> {
  try {
    const utapi = new UTApi();
    await utapi.deleteFiles([fileKey]);
    console.log("ファイルを削除しました:", fileKey);
    return true;
  } catch (error) {
    console.error("ファイルの削除に失敗しました:", error);
    return false;
  }
}

/**
 * 古い画像をUploadThingから削除
 * デフォルト画像の場合は削除しない
 * @param imageUrl 削除する画像のURL
 * @returns 削除に成功した場合はtrue、失敗またはスキップした場合はfalse
 */
export async function deleteOldImage(
  imageUrl: string | undefined,
): Promise<boolean> {
  if (!imageUrl) return false;

  // デフォルト画像の場合は削除しない
  if (imageUrl.includes("/image/no-image.png")) return false;

  const fileKey = extractFileKeyFromUrl(imageUrl);
  if (!fileKey) {
    console.warn("ファイルキーを抽出できませんでした:", imageUrl);
    return false;
  }

  return await deleteFileFromUploadThing(fileKey);
}

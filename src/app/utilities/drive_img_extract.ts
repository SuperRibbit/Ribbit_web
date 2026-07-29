const DRIVE_FILE_ID_REGEX = /\/file\/d\/([a-zA-Z0-9_-]+)/;

function extractDriveFileId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(DRIVE_FILE_ID_REGEX);
  return match ? match[1] : null;
}
export function toDriveImageUrl(
  url: string | null | undefined,
  fallback: string = 'assets/imageScratch.png'
): string {
  if (!url) return fallback;

  const fileId = extractDriveFileId(url);
  if (!fileId) return url;

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

export function toDrivePreviewUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const fileId = extractDriveFileId(url);
  if (!fileId) return url;

  return `https://drive.google.com/file/d/${fileId}/preview`;
}
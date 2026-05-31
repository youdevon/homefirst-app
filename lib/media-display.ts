export function isImageMediaFile(fileType: string): boolean {
  return fileType.startsWith("image/");
}

export function formatMediaDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getMediaTypeLabel(fileType: string): string {
  if (fileType.startsWith("image/")) {
    return "Image";
  }

  if (fileType.startsWith("video/")) {
    return "Video";
  }

  return "Document";
}

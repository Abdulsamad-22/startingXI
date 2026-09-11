export async function compressImage(
  file: File,
  maxSize = 400,
  quality = 0.8,
): Promise<File> {
  const img = await createImageBitmap(file);

  let { width, height } = img;
  if (width > height && width > maxSize) {
    height = Math.round((height / width) * maxSize);
    width = maxSize;
  } else if (height > maxSize) {
    width = Math.round((width / height) * maxSize);
    height = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/jpeg", quality),
  );

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function normalizeType(type: string): string {
  const lower = (type || "").toLowerCase();
  if (lower === "image/jpg") return "image/jpeg";
  return lower;
}

function isHeic(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name)
  );
}

async function convertHeic(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;
  const convertedBlob = (await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  })) as Blob | Blob[];

  const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
  if (!blob) {
    throw new Error("Failed to convert HEIC image");
  }
  return new File(
    [blob],
    file.name.replace(/\.(heic|heif)$/i, ".jpg"),
    { type: "image/jpeg" }
  );
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function resizeDims(
  width: number,
  height: number,
  maxEdge: number
): { width: number; height: number } {
  if (width > maxEdge || height > maxEdge) {
    if (width > height) {
      return { width: maxEdge, height: Math.round((height / width) * maxEdge) };
    }
    return { width: Math.round((width / height) * maxEdge), height: maxEdge };
  }
  return { width, height };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/jpeg",
  quality = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

export async function compressImage(
  file: File
): Promise<{ base64: string; file: File }> {
  let processedFile = file;

  if (isHeic(file)) {
    processedFile = await convertHeic(file);
  }

  processedFile = new File([processedFile], processedFile.name, {
    type: normalizeType(processedFile.type),
  });

  if (!ACCEPTED_TYPES.has(processedFile.type)) {
    throw new Error(
      `Unsupported image type: ${processedFile.type}. Allowed: JPEG, PNG, WebP, HEIC`
    );
  }

  const img = await loadImage(processedFile);
  const { width, height } = resizeDims(img.width, img.height, 1024);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  const base64 = dataUrl.split(",")[1];

  const blob = await canvasToBlob(canvas);
  const compressedFile = new File(
    [blob],
    processedFile.name.replace(/\.[^.]+$/, ".jpg"),
    { type: "image/jpeg" }
  );

  return { base64, file: compressedFile };
}

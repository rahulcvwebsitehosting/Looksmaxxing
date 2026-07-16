export function compressImage(file: File): Promise<{ base64: string; file: File }> {
  return new Promise(async (resolve, reject) => {
    try {
      let processedFile: File = file;

      if (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        /\.(heic|heif)$/i.test(file.name)
      ) {
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = (await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        })) as Blob | Blob[];

        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        if (!blob) {
          reject(new Error("Failed to convert HEIC image"));
          return;
        }
        processedFile = new File(
          [blob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" }
        );
      }

      const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!acceptedTypes.includes(processedFile.type)) {
        reject(
          new Error(
            `Unsupported image type: ${processedFile.type}. Allowed: JPEG, PNG, WebP, HEIC`
          )
        );
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(processedFile);

      img.onload = () => {
        URL.revokeObjectURL(url);

        const MAX_EDGE = 1024;
        let { width, height } = img;

        if (width > MAX_EDGE || height > MAX_EDGE) {
          if (width > height) {
            height = Math.round((height / width) * MAX_EDGE);
            width = MAX_EDGE;
          } else {
            width = Math.round((width / height) * MAX_EDGE);
            height = MAX_EDGE;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const base64 = dataUrl.split(",")[1];

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            const compressedFile = new File(
              [blob],
              processedFile.name.replace(/\.[^.]+$/, ".jpg"),
              { type: "image/jpeg" }
            );
            resolve({ base64, file: compressedFile });
          },
          "image/jpeg",
          0.9
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };

      img.src = url;
    } catch (err) {
      reject(err instanceof Error ? err : new Error("Image compression failed"));
    }
  });
}

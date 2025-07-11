export async function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleFactor = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scaleFactor;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context error'));

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Image compression failed'));
      }, 'image/jpeg');
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

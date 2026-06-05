import { readFile } from "fs/promises";
import path from "path";

export async function extractText(
  filePath: string,
  fileType: string
): Promise<string> {
  const ext = fileType.toLowerCase();

  if (ext === "pdf") {
    try {
      const pdfParse = (await import("pdf-parse")).default;
      const buffer = await readFile(filePath);
      const data = await pdfParse(buffer);
      return data.text?.trim() || "";
    } catch {
      return "";
    }
  }

  if (ext === "txt") {
    const content = await readFile(filePath, "utf-8");
    return content.trim();
  }

  // DOCX/PPTX: accepted but demo fallback text for MVP
  if (ext === "docx" || ext === "pptx" || ext === "doc" || ext === "ppt") {
    const fileName = path.basename(filePath);
    return `[${fileName}] Bu dosya yüklendi. MVP sürümünde DOCX/PPTX metin çıkarma sınırlıdır — demo içerik üretilecektir. Gerçek içerik analizi için PDF veya TXT kullanın.`;
  }

  return "";
}

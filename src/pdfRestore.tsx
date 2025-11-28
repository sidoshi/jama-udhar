import { useAppStore } from "./store";
import type { CashBook } from "./store/slices/cashBookSlice";

export function handlePDFRestore() {
  // Create a hidden file input to select PDF
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/pdf";
  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);

      // Use pdf-lib to read metadata
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(pdfData);
      const metadata = pdfDoc.getTitle();

      if (metadata) {
        try {
          const cashBook: CashBook = JSON.parse(metadata);
          useAppStore.getState().loadToCleanStateFromPDF(cashBook);
        } catch (e) {
          console.error(e);
          alert("Failed to parse accounting data from PDF metadata.");
        }
      } else {
        alert("No accounting data found in PDF metadata.");
      }
    }
  };
  input.click();
}

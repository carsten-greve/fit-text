import { jsPDF } from "jspdf";
import { useApp } from '../AppProvider';
import { getShapeBoundaries } from '../utilities/getShapeBoundaries';
import { getTextLayout } from '../utilities/getTextLayout';

export const PdfSaver = () => {
  const { segments, sampleCount, selectedFont, fontSize, lineSpacing, textToFit } = useApp();

  const saveAsPdf = () => {
    const shapeBoundaries = getShapeBoundaries(segments, sampleCount);
    const words = textToFit.split(/\s+/);
    const { lines } = getTextLayout(words, lineSpacing, shapeBoundaries, selectedFont.name, fontSize);
    const width = shapeBoundaries.rightX - shapeBoundaries.leftX;
    const height = shapeBoundaries.bottomY - shapeBoundaries.topY;
    const offsetX = fontSize;
    const offsetY = 1.7 * fontSize;

    const doc = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "pt",
      format: [width + 2 * fontSize, height + 2 * fontSize],
    });

    if (selectedFont.base64Content) {
      doc.addFileToVFS(selectedFont.name, selectedFont.base64Content);
      doc.addFont(selectedFont.name, selectedFont.name, "normal");
    }
    doc.setFont(selectedFont.name);
    doc.setFontSize(fontSize);

    for (const line of lines) {
      let currentX = line.x;
      for (const word of line.words) {
        const wordX = currentX;
        currentX += word.width + line.spaceWidth;

        doc.text(word.text, offsetX + wordX - shapeBoundaries.leftX, offsetY + line.y - shapeBoundaries.topY);
      }
    }

    doc.save("fit-text.pdf");
  }

  return (
    <div className="border-l pl-2">
      <button
        className="w-10 rounded bg-blue-600 px-2 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        onClick={saveAsPdf}
      >
        Save as PDF
      </button>
    </div>
  );
}

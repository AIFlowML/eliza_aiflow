import { Service, ServiceType } from "@ai16z/eliza";
import { getDocument } from "pdfjs-dist";
export class PdfService extends Service {
    constructor() {
        super();
    }
    getInstance() {
        return PdfService.getInstance();
    }
    async initialize(_runtime) { }
    async convertPdfToText(pdfBuffer) {
        // Convert Buffer to Uint8Array
        const uint8Array = new Uint8Array(pdfBuffer);
        const pdf = await getDocument({ data: uint8Array })
            .promise;
        const numPages = pdf.numPages;
        const textPages = [];
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .filter(isTextItem)
                .map((item) => item.str)
                .join(" ");
            textPages.push(pageText);
        }
        return textPages.join("\n");
    }
}
PdfService.serviceType = ServiceType.PDF;
// Type guard function
function isTextItem(item) {
    return "str" in item;
}
//# sourceMappingURL=pdf.js.map
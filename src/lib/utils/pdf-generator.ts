import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CareerAnalysis } from "@/lib/ai/types";

export const generateCareerReportPDF = async (data: CareerAnalysis, elementId: string) => {
    const input = document.getElementById(elementId);
    if (!input) return;

    // Create a temporary clone for PDF generation to customize styles if needed
    const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Multi-page handling if content is tall
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
    }

    pdf.save(`Talanta_Career_Report_${data.top_careers[0].career_name.replace(/\s+/g, '_')}.pdf`);
};

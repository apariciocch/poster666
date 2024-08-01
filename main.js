import { Document, Packer, Paragraph, ImageRun } from 'https://unpkg.com/docx@8.1.0/build/index.es5.min.js';

document.getElementById('imageInput').addEventListener('change', previewImage);
document.getElementById('generatePDF').addEventListener('click', generatePDF);
document.getElementById('generateWord').addEventListener('click', generateWord);

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pageCount = parseInt(document.getElementById('pageCount').value);
    const imgData = document.getElementById('preview').src;

    if (!imgData) {
        alert("Por favor, suba una imagen primero.");
        return;
    }

    const marginCm = 2;
    const marginPx = marginCm * 28.35; // Conversión de cm a px (1 cm = 28.35 px)

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [612, 792] // Tamaño A4 en pixeles
    });

    const img = new Image();
    img.src = imgData;

    img.onload = function() {
        // ... (el resto del código de generatePDF permanece igual)
    };
}

async function generateWord() {
    const pageCount = parseInt(document.getElementById('pageCount').value);
    const imgData = document.getElementById('preview').src;

    if (!imgData) {
        alert("Por favor, suba una imagen primero.");
        return;
    }

    const marginCm = 2;
    const marginPx = marginCm * 28.35; // Conversión de cm a px (1 cm = 28.35 px)

    const img = new Image();
    img.src = imgData;

    img.onload = async function() {
        const imgWidth = img.width;
        const imgHeight = img.height;

        const cols = Math.ceil(Math.sqrt(pageCount));
        const rows = Math.ceil(pageCount / cols);

        const pageWidth = 612;
        const pageHeight = 792;

        const contentWidth = pageWidth - 2 * marginPx;
        const contentHeight = pageHeight - 2 * marginPx;

        const totalWidth = contentWidth * cols;
        const totalHeight = contentHeight * rows;

        const scale = Math.min(totalWidth / imgWidth, totalHeight / imgHeight);

        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        const doc = new Document({
            sections: Array.from({ length: rows * cols }, (_, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;
                return {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: imgData,
                                    transformation: {
                                        width: totalWidth,
                                        height: totalHeight,
                                    },
                                    floating: {
                                        horizontalPosition: {
                                            offset: -col * contentWidth + marginPx,
                                        },
                                        verticalPosition: {
                                            offset: -row * contentHeight + marginPx,
                                        },
                                    },
                                }),
                            ],
                        }),
                    ],
                    margins: {
                        top: marginPx,
                        bottom: marginPx,
                        left: marginPx,
                        right: marginPx,
                    },
                };
            }),
        });

        const buffer = await Packer.toBlob(doc);
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "poster.docx";
        link.click();
    };
}
import * as pdfjsLib from "../pdfjs/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("pdfjs/pdf.worker.mjs");


const params = new URLSearchParams(window.location.search);

const pdfUrl = params.get("pdf");

if (!pdfUrl) {
    console.error("No PDF URL provided.");
    throw new Error("No PDF URL provided.");
}


const book = document.getElementById("book");


async function loadPDF() {
    try {


        const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl
        });

        const pdf = await loadingTask.promise;


        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

            const page = await pdf.getPage(pageNumber);

            const scale = 1.5;

            const viewport = page.getViewport({
                scale
            });

            const pageContainer = document.createElement("div");

            pageContainer.className = "pdf-page";

            pageContainer.dataset.page = pageNumber;

            const canvas = document.createElement("canvas");

            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            
            canvas.height = viewport.height;

            pageContainer.appendChild(canvas);

            book.appendChild(pageContainer);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

        }

        console.log("PDF rendering complete.");

    } catch (error) {

        console.error("Failed to load PDF:", error);

        book.innerHTML = `
            <div class="error">
                Failed to load PDF.
                <br>
                Check the browser console for details.
            </div>
        `;
    }
}


loadPDF();
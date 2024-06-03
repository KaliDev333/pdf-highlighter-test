// import React, { useEffect, useRef } from 'react';
// import * as pdfjsLib from 'pdfjs-dist';
// import 'pdfjs-dist/build/pdf.worker.entry';
// import css from './PdfViewer.module.css';

// interface Props {
//   pdfUrl: string;
//   highlightedReference?: string;
// }

// const PdfViewer: React.FC<Props> = ({ pdfUrl, highlightedReference }) => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const loadPDF = async () => {
//       pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

//       const loadingTask = pdfjsLib.getDocument(pdfUrl);
//       const pdf = await loadingTask.promise;
//       renderPages(pdf);
//     };

//     const renderPages = async (pdf: any) => {
//       if (containerRef.current) {
//         containerRef.current.innerHTML = ''; // Clear previous content
//       }

//       for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//         const page = await pdf.getPage(pageNum);
//         const scale = 1.5;
//         const viewport = page.getViewport({ scale });

//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');
//         canvas.height = viewport.height;
//         canvas.width = viewport.width;
//         canvas.style.marginBottom = '10px'; // Add margin between pages

//         const renderContext = {
//           canvasContext: context!,
//           viewport,
//         };

//         await page.render(renderContext).promise;

//         const pageContainer = document.createElement('div');
//         pageContainer.style.position = 'relative';
//         pageContainer.style.width = `${viewport.width}px`;
//         pageContainer.style.height = `${viewport.height}px`;
//         pageContainer.appendChild(canvas);

//         const textLayerDiv = document.createElement('div');
//         textLayerDiv.className = 'textLayer';
//         textLayerDiv.style.position = 'absolute';
//         textLayerDiv.style.top = '0';
//         textLayerDiv.style.left = '0';
//         textLayerDiv.style.height = `${viewport.height}px`;
//         textLayerDiv.style.width = `${viewport.width}px`;
//         pageContainer.appendChild(textLayerDiv);

//         if (containerRef.current) {
//           containerRef.current.appendChild(pageContainer);
//         }

//         const textContent = await page.getTextContent();
//         pdfjsLib.renderTextLayer({
//           textContent,
//           container: textLayerDiv as any,
//           viewport,
//           textDivs: [],
//           enhanceTextSelection: true,
//         });

//         if (highlightedReference) {
//           highlightMatches(textLayerDiv, highlightedReference);
//         }
//       }
//     };

//     loadPDF().catch(console.error);
//   }, [pdfUrl, highlightedReference]);

//   const highlightMatches = (textLayerDiv: HTMLDivElement, searchText: string) => {
//     const textItems = Array.from(textLayerDiv.querySelectorAll('span'));
//     textItems.forEach((textItem) => {
//       const text = textItem.textContent?.toLowerCase() || '';
//       const lowerSearchText = searchText.toLowerCase();
//       if (text.includes(lowerSearchText)) {
//         const regex = new RegExp(`(${lowerSearchText})`, 'gi');
//         textItem.innerHTML = textItem.textContent!.replace(regex, `<span style="background-color: yellow;">$1</span>`);
//       }
//     });
//   };

//   return (
//     <div className={css.pdfViewerContainer}>
//       <div ref={containerRef} className={css.allDiv} style={{ position: 'relative' }} />
//     </div>
//   );
// };

// export default PdfViewer;








////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import css from './PdfViewer.module.css'

interface PdfViewerProps {
  pdfUrl: string;
  searchText: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, searchText }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPdfDocument(pdf);
    };

    loadPDF();
  }, [pdfUrl]);

  useEffect(() => {
    const renderPages = async () => {
      if (containerRef.current && pdfDocument) {
        containerRef.current.innerHTML = '';

        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.4 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport,
          };

          await page.render(renderContext).promise;
          containerRef.current.appendChild(canvas);

          if (searchText) {
            const textContent = await page.getTextContent();
            const textItems = textContent.items as any[];
            const textString = textItems.map(item => item.str).join(' ');
            // console.log(textString)

            if (textString.replace(/\s/g, '').includes(searchText.replace(/\s/g, ''))) {
              canvas.scrollIntoView();
            }
          }
        }
      }
    };

    renderPages();
  }, [pdfDocument, searchText]);

  return <div ref={containerRef} className={css.allDiv} />;
};

export default PdfViewer;
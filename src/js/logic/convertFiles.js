export const convertFiles = async (files, callback) => {
  let convertedFiles = [];
  let pdfFiles = [];
  let convertedIndex = 0;
  let targetIndex = 0;

  files.forEach(file => {
    if (file.type.includes('pdf')) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.addEventListener('load', async () => {
        const task = pdfjsLib.getDocument({ data: reader.result });
        let res = await task.promise;
        targetIndex += res.numPages;
      });
    } else if (file.type.includes('image')) {
      targetIndex++;
    }
  });

  files.forEach(file => {
    if (file.type.includes('pdf')) {
      // Reading The PDF
      let pdf = null;
      let processedPageIndex = 0;
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.addEventListener('load', async () => {
        const task = pdfjsLib.getDocument({ data: reader.result });
        let res = await task.promise;
        pdf = res;

        // Converting it to Images
        [...Array(pdf.numPages)].forEach(async (_, index, arr) => {
          let pageIndex = index + 1;
          let scale = 2;
          let page = await pdf.getPage(pageIndex);
          let viewport = page.getViewport({ scale });
          let canvas = document.createElement('canvas');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          let canvasContext = canvas.getContext('2d');
          let renderContext = {
            canvasContext,
            viewport,
          };
          let task = page.render(renderContext);
          await task.promise;
          pdfFiles.push({ src: canvas.toDataURL(), index: pageIndex });
          convertedIndex++;
          processedPageIndex++;
          if (processedPageIndex == pdf.numPages) {
            pdfFiles.sort((a, b) => (a.index > b.index ? 1 : -1));
            convertedFiles = [
              ...convertedFiles,
              ...pdfFiles.map(cur => cur.src),
            ];
            pdfFiles = [];
            processedPageIndex = 0;
          }
          if (convertedIndex == targetIndex) {
            callback(convertedFiles);
          }
        });
      });
    } else if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        convertedFiles.push(reader.result);
        convertedIndex++;
        if (convertedIndex == targetIndex) {
          callback(convertedFiles);
        }
      });
    }
  });
  return convertedFiles;
};

const convertImageToDataURL = () => {};

const download = () => {};

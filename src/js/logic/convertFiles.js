import jspdf from 'jspdf';

const sorter = arr => {
  let toSort = arr.map(el => el.order);
  console.log(toSort);
  toSort.sort((a, b) => {
    if (a[0] < b[0]) {
      return -1;
    } else if (a[0] > b[0]) {
      return 1;
    } else if (a[0] == b[0]) {
      if (a[1] < b[1]) {
        return -1;
      } else {
        return 1;
      }
    }
  });

  let newArr = [];
  toSort.forEach(order => {
    let el = arr.find(cur => cur.order == order);
    newArr.push(el);
  });

  let finalArr = newArr.map(cur => cur.src);

  return finalArr;
};

export const convertFiles = async (files, callback) => {
  let convertedFiles = [];
  let pdfFiles = [];
  let rawFiles = [];
  let convertedIndex = 0;
  let targetIndex = 0;
  let noOfFiles = files.length;
  let rawIndex = 0;

  files.forEach(async (file, sortIndex) => {
    if (file.type.includes('pdf')) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.addEventListener('load', async () => {
        const task = pdfjsLib.getDocument({ data: reader.result });
        let res = await task.promise;
        targetIndex += res.numPages;
        rawIndex++;
        rawFiles.push({ file, index: sortIndex });
      });
    } else if (file.type.includes('image')) {
      targetIndex++;
      rawFiles.push({ file, index: sortIndex });
    }
  });

  const waitForRawFiles = () => {
    if (noOfFiles == rawFiles.length) {
      rawFiles.forEach(({ file, index: sortIndex }) => {
        console.log(file);
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
              // COnfigure pdf.js page
              let pageIndex = index + 1;
              let scale = 2;
              let page = await pdf.getPage(pageIndex);
              let viewport = page.getViewport({ scale });

              // Render PDF pagr to canvas using pdf.js
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

              // Use dataurl of canvas as source for fcanvas
              pdfFiles.push({
                src: canvas.toDataURL(),
                order: [sortIndex, pageIndex],
              });
              convertedIndex++;
              processedPageIndex++;

              // Sort pages according to index (again due to async nature of pdf.js this step is needed)
              if (processedPageIndex == pdf.numPages) {
                pdfFiles.sort((a, b) => (a.index > b.index ? 1 : -1));
                convertedFiles = [...convertedFiles, ...pdfFiles];
                pdfFiles = [];
              }

              // If all pages have been converted and sorted, call setFiles in Editor.js
              if (convertedIndex == targetIndex) {
                console.log('finally its done');
                callback(sorter(convertedFiles));
              }
            });
          });
        } else if (file.type.includes('image')) {
          // Read Imahe
          const reader = new FileReader();
          reader.readAsDataURL(file);

          // Once image is loaded, use its dataurl as source for fcanvas
          reader.addEventListener('load', () => {
            convertedFiles.push({ src: reader.result, order: [sortIndex, -1] });
            convertedIndex++;

            // If all pages (including images) have been converted and sorted, call setFiles in Editor.js
            if (convertedIndex == targetIndex) {
              callback(sorter(convertedFiles));
              console.log('finally its done');
            }
          });
        }
      });
    } else {
      setTimeout(() => {
        waitForRawFiles();
      }, 100);
    }
  };
  waitForRawFiles();
  return convertedFiles;
};

// Use jspdf to convert dataurls from fcanvases (Editor.js state) to pdf
export const download = (fileName, fcanvases, callback) => {
  // Initialize doc using default config
  let doc = new jspdf('1', 'pt', 'a4');

  //
  fcanvases.forEach((fcanvas, index) => {
    // Set some variables based on dimensions and dataurl of image
    let src = fcanvas.toDataURL({ format: 'png' });
    let width = fcanvas.width;
    let height = fcanvas.height;

    /*
    If width > height ---> Page is in landscape orientation, use landscape (l) as orientation
    If height >= width --> Page in in portrait orientation, use portrait (p) as orientation
    */
    let orientation = width > height ? 'l' : 'p';
    doc.addPage([width, height], orientation);
    doc.addImage(src, 'PNG', 0, 0, width, height, null, 'NONE');
  });

  // First page takes default config. Pages might have changed orientation, so delete first page.
  doc.deletePage(1);

  // Download PDF
  doc.save(fileName);

  // Hide the loading text which shows when file is processing
  callback();
};

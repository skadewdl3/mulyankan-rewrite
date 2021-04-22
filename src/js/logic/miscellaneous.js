const checkMark = object => {
  if (!object.isOnScreen()) return 0;
  if (object.text == '') return 0;
  if (isNaN(object.text)) return 0;
  return parseFloat(object.text);
};

export const changeMarks = ({ state, setMarks }) => {
  let marksArray = [];
  state.fcanvases.forEach(fcanvas => {
    let markBoxes = fcanvas
      .getObjects()
      .filter(object => object.textType == 'mark');
    marksArray = [...marksArray, ...markBoxes.map(cur => checkMark(cur))];
  });
  let totalMarks = marksArray.reduce((a, b) => a + b, 0);
  setMarks(totalMarks);
};

export const changeActiveCanvas = (index, { state, setFCanvases }) => {
  let newFCanvases = state.fcanvases.map((fcanvas, i) => {
    if (i === index) {
      fcanvas.activeCanvas = true;
      return fcanvas;
    }
    fcanvas.activeCanvas = false;
    return fcanvas;
  });
  setFCanvases(newFCanvases);
};

export const copyObject = (index, { state }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (i == index) {
      fcanvas.fire('copy');
    }
  });
};

export const pasteObject = (index, coords, { state }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (i == index) {
      fcanvas.fire('paste', { coords });
    }
  });
};

export const removeObject = (index, { state }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (i == index) {
      fcanvas.fire('remove');
    }
  });
};

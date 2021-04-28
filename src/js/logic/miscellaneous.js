// Verify whether markbox contains marks
const checkMark = object => {
  if (!object.isOnScreen()) return 0; // don't change marks if markbox is outside canvas
  if (object.text == '') return 0; // don't change marks if markbox is empty
  if (isNaN(object.text)) return 0; // don't chnage marks if markbox contains text not numbers
  return parseFloat(object.text);
};

export const changeMarks = ({ state, setMarks }) => {
  // Marks of each markbox will be added to this array
  let marksArray = [];
  state.fcanvases.forEach(fcanvas => {
    let markBoxes = fcanvas
      .getObjects()
      .filter(object => object.textType == 'mark');
    marksArray = [...marksArray, ...markBoxes.map(cur => checkMark(cur))];
  });

  // Add up all the marks
  let totalMarks = marksArray.reduce((a, b) => a + b, 0);

  // Update Marks
  setMarks(totalMarks);
};

// Make canvas at index in fcanvases activeCanvas
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

// Fire copy event on canvas when contextmenu button is pressed / ctrl + c is pressed
export const copyObject = (index, { state }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (i == index) {
      fcanvas.fire('copy');
    }
  });
};

// Fire copy event on canvas when contextmenu button is pressed / ctrl + v is pressed
export const pasteObject = (index, coords, { state }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (i == index) {
      fcanvas.fire('paste', { coords });
    }
  });
};

// Fire copy event on canvas when contextmenu button is pressed / delete is pressed
export const removeObject = (index, { state }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (i == index) {
      fcanvas.fire('remove');
    }
  });
};

/*
Fire copy event on canvas when contextmenu button is pressed / ctrl + f is pressed

Though it is called quickAccess, the name is used only for nomenclature purposes.
It still refers to the favourited objects (called quickAccess in Editor.js state)
*/
export const updateQuickAccess = (index, { state }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (i == index) {
      fcanvas.fire('favourite');
    }
  });
};

// Verify whether markbox contains marks
export const checkMark = text => {
  if (text == '') return 0; // don't change marks if markbox is empty
  if (isNaN(text)) return 0; // don't chnage marks if markbox contains text not numbers
  return parseFloat(text);
};

export const changeMarks = ({ state, setMarks }) => {
  // Create array of all markboxes from all canvases
  let markBoxArray = [];
  state.fcanvases.forEach(fcanvas => {
    fcanvas._objects.forEach(obj => {
      if (obj.textType == 'mark') {
        markBoxArray.push(obj);
      }
    });
  });

  // Createarray of marks from markboxes in markBoxArray
  let marksArray = markBoxArray.map(obj => checkMark(obj.text));

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

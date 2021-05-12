export const setZoomLevel = (val, reset, { state, setFCanvases }) => {
  // Apply this for every object on every canvas
  let newFcArr = state.fcanvases.map((fcanvas, index) => {
    /*
    Calculate scale factor:
    Zoom In ---> 1.1
    Zoom Out --> 0.9
    Reset -----> Dynamically Calculated based on Current Dimensions of Canvas and Original Dimensions 
    */
    let factor;
    let canvas = document.querySelector(`#canvas-${index}`);
    if (reset) factor = fcanvas.originalDimensions.width / fcanvas.width;
    else factor = val;

    // Scale canvas element
    canvas.width = fcanvas.getWidth() * factor;
    canvas.height = fcanvas.getHeight() * factor;

    // scale Fabric.js canvas
    fcanvas.setDimensions({
      width: fcanvas.getWidth() * factor,
      height: fcanvas.getHeight() * factor,
    });

    // Scale Every object in fabric.js canvas
    let objects = fcanvas.getObjects();
    objects.forEach((object, i) => {
      object.scaleX *= factor;
      object.scaleY *= factor;
      object.top *= factor;
      object.left *= factor;
      object.setCoords();
      fcanvas.renderAll();

      // Set Default property
      fcanvas.zoom = fcanvas.zoom * factor;
      fcanvas._objects[0].zoom = fcanvas.zoom * factor;
    });
    fcanvas.renderAll();
    return fcanvas;
  });

  // Update fcanvases array in Editor.js state
  setFCanvases(newFcArr);
};

// Move Object on up/down/left/right keypress
export const moveObject = (direction, { state }) => {
  let factor = 2;
  let fcanvas = state.fcanvases.filter((fcanvas, i) => fcanvas.activeCanvas)[0];
  if (!fcanvas) return;
  let obj = fcanvas.getActiveObject();
  if (!obj) return;

  // Update top/left coordinates according to direction
  if (direction == 'up') {
    obj.top = obj.top - factor;
  } else if (direction == 'down') {
    obj.top = obj.top + factor;
  } else if (direction == 'left') {
    obj.left = obj.left - factor;
  } else if (direction == 'right') {
    obj.left = obj.left + factor;
  }
  obj.setCoords();
  fcanvas.renderAll();
};

export const updateFont = (font, { state }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (fcanvas.activeCanvas) {
      fcanvas.fire('changeFont', { font });
    }
  });
};

export const updateColor = (hex, { state }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (fcanvas.activeCanvas) {
      fcanvas.fire('updateColor', { hex });
    }
  });
};

/*
Update defaultTextOptions (Editor,js state) based on;
1. activeObject on fcanvas changes
2. No object is active on fcanvas
3. Properties of Object are changed in TextTab.js
*/

export const updateText = (data, { state, updateDefaultTextOptions }) => {
  [...state.fcanvases].forEach((fcanvas, i) => {
    if (fcanvas.activeCanvas) {
      if (data.font) {
        updateDefaultTextOptions(data);

        fcanvas.fire('changeFont', data);
      }
      if (data.bold != null && data.bold != undefined) {
        updateDefaultTextOptions(data);
        fcanvas.fire('bold', data);
      }

      if (data.italic != null && data.italic != undefined) {
        updateDefaultTextOptions(data);
        fcanvas.fire('italic', data);
      }
      if (data.underline != null && data.underline != undefined) {
        updateDefaultTextOptions(data);
        fcanvas.fire('underline', data);
      }
      if (data.superscript != null && data.superscript != undefined) {
        updateDefaultTextOptions(data);
        fcanvas.fire('superscript', data);
      }
      if (data.subscript != null && data.subscript != undefined) {
        updateDefaultTextOptions(data);
        fcanvas.fire('subscript', data);
      }
      if (data.align != null && data.align != undefined) {
        updateDefaultTextOptions(data);
        fcanvas.fire('align', data);
      }
    }
  });
};

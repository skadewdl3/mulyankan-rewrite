export const setZoomLevel = (val, reset, { state, setFCanvases }) => {
  let newFcArr = state.fcanvases.map((fcanvas, index) => {
    let factor;
    let canvas = document.querySelector(`#canvas-${index}`);
    if (reset) factor = fcanvas.originalDimensions.width / fcanvas.width;
    else factor = val;
    canvas.width = fcanvas.getWidth() * factor;
    canvas.height = fcanvas.getHeight() * factor;
    fcanvas.setDimensions({
      width: fcanvas.getWidth() * factor,
      height: fcanvas.getHeight() * factor,
    });
    let objects = fcanvas.getObjects();
    objects.forEach((object, i) => {
      object.scaleX *= factor;
      object.scaleY *= factor;
      object.top *= factor;
      object.left *= factor;

      object.setCoords();
      fcanvas.renderAll();
      fcanvas.zoom = fcanvas.zoom * factor;
      fcanvas._objects[0].zoom = fcanvas.zoom * factor;
    });
    fcanvas.renderAll();
    return fcanvas;
  });
  setFCanvases(newFcArr);
};

export const moveObject = (direction, { state }) => {
  let factor = 2;
  let fcanvas = state.fcanvases.filter((fcanvas, i) => fcanvas.activeCanvas)[0];
  if (!fcanvas) return;
  let obj = fcanvas.getActiveObject();
  if (!obj) return;

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
  console.log('this ran');
};

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
    }
  });
};

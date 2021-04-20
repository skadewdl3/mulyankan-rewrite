export const setZoomLevel = (val, reset, { state, setFCanvases }) => {
  let newFcArr = state.fcanvases.map(fcanvas => {
    let factor;
    if (reset) factor = fcanvas.originalDimensions.width / fcanvas.width;
    else factor = val;
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

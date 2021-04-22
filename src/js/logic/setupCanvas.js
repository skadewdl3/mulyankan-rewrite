import { fabric } from 'fabric-with-gestures';
import {
  addObject,
  zoomOnKeyPress,
  copyActiveObject,
  pasteCopiedObject,
  removeActiveObject,
  removeObjectOutsideCanvas,
} from './canvasEventListeners';

export const createCanvas = (id, canvasData) => {
  let { addCanvas, src, height, width } = canvasData;

  console.log({ id, src });
  let fcanvas = new fabric.Canvas(id);

  fcanvas.setDimensions({
    width,
    height,
  });

  configureBackgroundImage(src, fcanvas, width, height);
  setDefaultProperties(fcanvas, canvasData);
  addEventListeners(fcanvas, canvasData);
  addCanvas(fcanvas);
};

const configureBackgroundImage = (src, fcanvas, width, height) => {
  fabric.Image.fromURL(src, img => {
    fcanvas.add(img);
    fcanvas.sendToBack(img);
    let backgroundImage = fcanvas._objects[0];
    const backgroundImageConfig = {
      evented: false,
      selectable: false,
      hasBorders: false,
      hasControls: false,
      hasRotatingPoint: false,
      originX: 'center',
      originY: 'center',
      top: height / 2,
      left: width / 2,
    };
    backgroundImage.set(backgroundImageConfig);
    fcanvas.renderAll();
  });
};

const setDefaultProperties = (fcanvas, canvasData) => {
  const { width, height, index } = canvasData;
  fcanvas.originalDimensions = { width, height };
  fcanvas.activeCanvas = index == 0 ? true : false;
};

const addEventListeners = (fcanvas, canvasData) => {
  fcanvas.on('drop', e => addObject(e, fcanvas, canvasData));
  fcanvas.on('object:added', e => canvasData.updateMarks());
  fcanvas.on('object:removed', e => canvasData.updateMarks());
  fcanvas.on('object:moved', e => removeObjectOutsideCanvas(e, fcanvas));
  fcanvas.on('text:changed', () => canvasData.updateMarks());
  fcanvas.on('copy', e => copyActiveObject(fcanvas));
  fcanvas.on('paste', ({ coords }) => pasteCopiedObject(coords, fcanvas));
  fcanvas.on('remove', e => removeActiveObject(fcanvas));
  zoomOnKeyPress(canvasData);
};

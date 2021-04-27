import { fabric } from 'fabric-with-gestures';
import {
  addObject,
  zoomOnKeyPress,
  copyActiveObject,
  pasteCopiedObject,
  removeActiveObject,
  removeObjectOutsideCanvas,
  moveObjectWithArrowKeys,
  favourite,
  changeFont,
  changeColor,
  contextMenuListsners,
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
  let prevActiveObj = null;

  let getPrevActiveObj = () => prevActiveObj;

  fcanvas.on('drop', e => addObject(e, fcanvas, canvasData));
  fcanvas.on('object:added', () => {
    canvasData.updateMarks();
    canvasData.setActiveCanvas(canvasData.index);
  });
  fcanvas.on('object:removed', () => canvasData.updateMarks());
  fcanvas.on('object:moved', e => removeObjectOutsideCanvas(e, fcanvas));
  fcanvas.on('selection:created', ({ selected }) => {
    let obj = selected[0];
    if (!obj) return;
    console.log(obj);
    prevActiveObj = obj;
    if (!obj.textType) return;
    canvasData.updateDefaultFontOption(obj.fontFamily);
  });
  fcanvas.on('selection:updated', ({ selected }) => {
    let obj = selected[0];
    if (!obj) return;
    console.log(obj);
    prevActiveObj = obj;
    if (!obj.textType) return;
    canvasData.updateDefaultFontOption(obj.fontFamily);
  });
  fcanvas.on('text:changed', () => canvasData.updateMarks());
  fcanvas.on('copy', () => copyActiveObject(fcanvas));
  fcanvas.on('paste', ({ coords }) => pasteCopiedObject(coords, fcanvas));
  fcanvas.on('remove', () => removeActiveObject(fcanvas));
  fcanvas.on('favourite', () => favourite(fcanvas, canvasData));
  fcanvas.on('changeFont', ({ font }) => changeFont(font, fcanvas));
  fcanvas.on('updateColor', ({ hex }) => changeColor(hex, fcanvas));
  zoomOnKeyPress(canvasData);
  moveObjectWithArrowKeys(canvasData);
  contextMenuListsners(canvasData, fcanvas, getPrevActiveObj);
};

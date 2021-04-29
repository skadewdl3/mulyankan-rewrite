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
  textChange,
} from './canvasEventListeners';

export const createCanvas = (id, canvasData) => {
  let { addCanvas, src, height, width } = canvasData;

  // Initialize fcanvas
  let fcanvas = new fabric.Canvas(id);

  // Set width and height of fcanvas
  fcanvas.setDimensions({
    width,
    height,
  });

  // Make background image unmovable, unselectable and a bunch of other stuff
  configureBackgroundImage(src, fcanvas, width, height);

  // set some defautl properties like activeCanvas which are used for event listeners
  setDefaultProperties(fcanvas, canvasData);
  addEventListeners(fcanvas, canvasData);

  // Add canvas to fcanvases in the state
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
  let prevActiveObj = null; // Used to place copied object
  let getPrevActiveObj = () => prevActiveObj;

  // Add Object on Drop
  fcanvas.on('drop', e => addObject(e, fcanvas, canvasData));

  // Object Event Listeners
  fcanvas.on('object:added', () => {
    canvasData.updateMarks();
    canvasData.setActiveCanvas(canvasData.index);
  });
  fcanvas.on('object:removed', () => canvasData.updateMarks());
  fcanvas.on('object:moved', e => removeObjectOutsideCanvas(e, fcanvas));

  // Selection Event Listeners
  fcanvas.on('selection:created', ({ selected }) => {
    let obj = selected[0];
    if (!obj) return;
    console.log(obj);
    prevActiveObj = obj;
    if (!obj.textType) return;
    canvasData.updateDefaultTextOptions({
      font: obj.fontFamily,
      italic: obj.fontStyle == 'italic',
      bold: obj.fontWeight == 'bolf',
      underline: obj.underline,
    });
  });
  fcanvas.on('selection:updated', ({ selected }) => {
    let obj = selected[0];
    if (!obj) return;
    console.log(obj);
    prevActiveObj = obj;
    if (!obj.textType) return;
    canvasData.updateDefaultTextOptions({
      font: obj.fontFamily,
      italic: obj.fontStyle == 'italic',
      bold: obj.fontWeight == 'bolf',
      underline: obj.underline,
    });
  });
  fcanvas.on('selection:cleared', () => {
    canvasData.updateDefaultTextOptions({
      font: 'Roboto',
      bold: false,
      italic: false,
      underline: false,
    });
  });

  // Text Event Listeners
  fcanvas.on('text:changed', () => canvasData.updateMarks());
  fcanvas.on('changeFont', ({ font }) =>
    textChange('font', { fontFamily: font }, canvasData, fcanvas)
  );
  fcanvas.on('bold', ({ bold }) =>
    textChange('bold', { bold }, canvasData, fcanvas)
  );
  fcanvas.on('italic', ({ italic }) =>
    textChange('italic', { italic }, canvasData, fcanvas)
  );
  fcanvas.on('underline', ({ underline }) =>
    textChange('underline', { underline }, canvasData, fcanvas)
  );
  fcanvas.on('superscript', ({ superscript }) =>
    textChange('superscript', { superscript }, canvasData, fcanvas)
  );
  fcanvas.on('subscript', ({ subscript }) =>
    textChange('subscript', { subscript }, canvasData, fcanvas)
  );

  // Context Menu Event Listeners
  fcanvas.on('copy', () => copyActiveObject(fcanvas));
  fcanvas.on('paste', ({ coords }) => pasteCopiedObject(coords, fcanvas));
  fcanvas.on('remove', () => removeActiveObject(fcanvas));
  fcanvas.on('favourite', () => favourite(fcanvas, canvasData));

  // Miscellaneous Event Listeners
  fcanvas.on('updateColor', ({ hex }) => changeColor(hex, fcanvas));
  zoomOnKeyPress(canvasData);
  moveObjectWithArrowKeys(canvasData);
  contextMenuListsners(canvasData, fcanvas, getPrevActiveObj);
};

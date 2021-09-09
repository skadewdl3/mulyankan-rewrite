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
  changeColor,
  contextMenuListsners,
  textChange,
  defaultObjectConfig,
} from './canvasEventListeners';

export const createCanvas = (id, data) => {
  let {
    addCanvas,
    src,
    height,
    width,
    uploadMethod,
    json,
    setUploadMethod,
    isLast,
    addJSONCanvas,
  } = data;
  let canvasData = data;

  // Initialize fcanvas
  let fcanvas = new fabric.Canvas(id);

  if (uploadMethod === 'json') {
    fcanvas.loadFromJSON(JSON.stringify(json), () => {
      // Set Dimensions of canvas to the dimensions of the background image
      let width = fcanvas._objects[0].width;
      let height = fcanvas._objects[0].height;
      let backgroundImage = fcanvas._objects[0];
      fcanvas.setDimensions({
        width,
        height,
      });

      fabric.util.enlivenObjects(fcanvas._objects, () => {
        console.log('objects enlivened');
      });

      // Update canvasData object to reflect changes in dimensions
      canvasData = { ...canvasData, height, width };

      // Make the background image unselectable, unmovable and a bunch of other stuff
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

      // Set some defaults for all objects except background image
      fcanvas._objects.forEach((obj, i) => {
        if (i !== 0) {
          obj.set({
            ...defaultObjectConfig,
          });
        }
      });
      fcanvas.renderAll();
    });
  } else {
    // Set width and height of fcanvas
    fcanvas.setDimensions({
      width,
      height,
    });

    // Make background image unmovable, unselectable and a bunch of other stuff
    configureBackgroundImage(src, fcanvas, width, height);
  }

  // set some defautl properties like activeCanvas which are used for event listeners
  setDefaultProperties(fcanvas, canvasData);

  // Add Event Listeners
  addEventListeners(fcanvas, canvasData);

  // Add canvas to fcanvases in the state
  if (uploadMethod === 'json') {
    addJSONCanvas(fcanvas, isLast);
  } else {
    addCanvas(fcanvas);
  }

  if (canvasData.isLast) {
    setUploadMethod('pdf');
  }
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
    canvasData.setActiveCanvas(canvasData.index);
    canvasData.setActiveObject(obj);
    prevActiveObj = obj;
    if (!obj.textType) return;
    canvasData.updateDefaultTextOptions({
      font: obj.fontFamily,
      italic: obj.fontStyle == 'italic',
      bold: obj.fontWeight == 'bolf',
      underline: obj.underline,
      align: obj.textAlign,
    });
  });
  fcanvas.on('selection:updated', ({ selected }) => {
    let obj = selected[0];
    if (!obj) return;
    canvasData.setActiveCanvas(canvasData.index);
    canvasData.setActiveObject(obj);

    prevActiveObj = obj;
    if (!obj.textType) return;
    canvasData.updateDefaultTextOptions({
      font: obj.fontFamily,
      italic: obj.fontStyle == 'italic',
      bold: obj.fontWeight == 'bold',
      underline: obj.underline,
      align: obj.textAlign,
    });
  });
  fcanvas.on('selection:cleared', () => {
    canvasData.setActiveObject(null);
    // canvasData.setActiveCanvas(canvasData.index);
    canvasData.updateDefaultTextOptions({
      font: 'Roboto',
      bold: false,
      italic: false,
      underline: false,
      align: null,
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
  fcanvas.on('align', ({ align }) =>
    textChange('align', { align }, canvasData, fcanvas)
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

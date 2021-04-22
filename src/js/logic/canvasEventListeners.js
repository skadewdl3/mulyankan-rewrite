import { fabric } from 'fabric-with-gestures';
import hotkeys from 'hotkeys-js';
import { throttle } from 'lodash';

let copiedObject = null;

const defaultImageWidth = 50;

const automarkConfig = {
  imgWidth: 300,
  imgHeight: 80,
  textWidth: 200,
  textHeight: 30,
};

const defaultObjectConfig = {
  fireRightClick: true,
  transparentCorners: false,
  cornerColor: '#6c5ce7',
  cornerSize: 7,
};

const defaultTextConfig = {
  width: 100,
  height: 30,
  fontSize: 40,
  fontFamily: 'sans-serif',
  fill: '#ff0000',
  textAlign: 'center',
};

export const addObject = ({ e }, fcanvas, canvasData) => {
  let dropCoords = fcanvas.getPointer(e);
  let type = e.dataTransfer.getData('type');
  let imageId = e.dataTransfer.getData('image');

  if (type == 'image') addImage(imageId, dropCoords, fcanvas);
  else if (type == 'text') addText(dropCoords, fcanvas);
  else if (type == 'mark') addMark(dropCoords, fcanvas);
  else if (type == 'automark')
    automark(dropCoords, fcanvas, canvasData.getMarks());
  fcanvas.renderAll();
};

export const addCopiedObject = (coords, fcanvas) => {
  if (copiedObject.textType == 'mark') {
    copiedObject.clone(clone => {
      clone.set({
        ...defaultObjectConfig,
        ...defaultTextConfig,
        width: clone.width,
        height: clone.height,
        top: coords.y - clone.get('height') / 2,
        left: coords.x - clone.get('width') / 2,
        textType: 'mark',
      });
      fcanvas.add(clone);
      clone.setCoords();
    });
  } else if (copiedObject.textType == 'text') {
    copiedObject.clone(clone => {
      clone.set({
        defaultObjectConfig,
        defaultTextConfig,
        width: clone.width,
        height: clone.height,
        top: coords.y - clone.get('height') / 2,
        left: coords.x - clone.get('width') / 2,
        textType: 'text',
      });
      fcanvas.add(clone);
      clone.setCoords();
    });
  }
};

const addImage = (id, dropCoords, fcanvas) => {
  let imgEl = document.querySelector(`.symbols-cp__${id}`);
  let img = new fabric.Image(imgEl);
  img.scaleToWidth(defaultImageWidth);
  let scale = defaultImageWidth / img.width;

  const imageConfig = {
    left: dropCoords.x - (img.width * scale) / 2,
    top: dropCoords.y - (img.height * scale) / 2,
    ...defaultObjectConfig,
  };
  img.set(imageConfig);
  fcanvas.add(img);
};

const addText = (dropCoords, fcanvas) => {
  let text = new fabric.Textbox('Text', {
    left: dropCoords.x - defaultTextConfig.width / 2,
    top: dropCoords.y - defaultTextConfig.height / 2,
    textType: 'text',
    ...defaultObjectConfig,
    ...defaultTextConfig,
  });
  fcanvas.add(text);
};

const addMark = (dropCoords, fcanvas) => {
  let mark = new fabric.Textbox('1', {
    left: dropCoords.x - defaultTextConfig.width / 2,
    top: dropCoords.y - defaultTextConfig.height / 2,
    textType: 'mark',
    ...defaultObjectConfig,
    ...defaultTextConfig,
  });
  fcanvas.add(mark);
};

const automark = (dropCoords, fcanvas, marks) => {
  let total = document.querySelector('.quickmarking__total').value;
  let imgEl = document.querySelector(`.symbols-cp__circle`);
  let img = new fabric.Image(imgEl);
  const imgConfig = {
    scaleX: automarkConfig.imgWidth / img.width,
    scaleY: automarkConfig.imgHeight / img.height,
    left: dropCoords.x - automarkConfig.imgWidth / 2,
    top: dropCoords.y - automarkConfig.imgHeight / 2,
    ...defaultObjectConfig,
  };
  img.set(imgConfig);
  const textConfig = {
    left: dropCoords.x - automarkConfig.textWidth / 2,
    top: dropCoords.y - automarkConfig.textHeight / 2,
    textType: 'text',
    ...defaultObjectConfig,
    ...defaultTextConfig,
    width: automarkConfig.textWidth,
    height: automarkConfig.textHeight,
  };
  let text = new fabric.Textbox(
    `${marks} / ${total ? total : 'Total'}`,
    textConfig
  );

  fcanvas.add(img);
  fcanvas.add(text);
};

export const zoomOnKeyPress = canvasData => {
  if (canvasData.shouldAddZoomListener) {
    hotkeys(
      'ctrl+-',
      throttle(
        e => {
          e.preventDefault();
          canvasData.setZoom(0.9);
        },
        100,
        { trailing: false }
      )
    );
    hotkeys(
      'ctrl+=',
      throttle(
        e => {
          e.preventDefault();
          canvasData.setZoom(1.1);
        },
        100,
        { trailing: false }
      )
    );
  }
};

export const copyActiveObject = fcanvas => {
  let obj = fcanvas.getActiveObject();
  copiedObject = obj;
  console.log(obj);
};

export const pasteCopiedObject = (coords, fcanvas) => {
  console.log('pasting');
  addCopiedObject(coords, fcanvas);
};

export const removeActiveObject = fcanvas => {
  let obj = fcanvas.getActiveObject();
  fcanvas.remove(obj);
};

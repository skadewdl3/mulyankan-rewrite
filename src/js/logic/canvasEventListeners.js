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
  fontFamily: 'Roboto',
  fill: '#ff0000',
  textAlign: 'center',
};

export const addObject = ({ e }, fcanvas, canvasData) => {
  let dropCoords = fcanvas.getPointer(e);
  let type = e.dataTransfer.getData('type');
  let imageData = e.dataTransfer.getData('image');
  let favourite = e.dataTransfer.getData('favourite');
  let obj = e.dataTransfer.getData('content');
  let fill = e.dataTransfer.getData('fill');

  if (favourite) addFavouritedObject(type, obj, dropCoords, fcanvas);
  else {
    if (type == 'image') addImage(imageData, dropCoords, fcanvas);
    else if (type == 'text') addText(dropCoords, fill, fcanvas);
    else if (type == 'mark') addMark(dropCoords, fill, fcanvas);
    else if (type == 'automark')
      automark(dropCoords, fcanvas, canvasData.getMarks());
  }

  fcanvas.renderAll();
};

const addFavouritedObject = (type, content, coords, fcanvas) => {
  let { obj } = JSON.parse(content);
  fabric.util.enlivenObjects([obj], ([clone]) => {
    if (type == 'text') {
      clone.set({
        ...defaultObjectConfig,
        ...defaultTextConfig,
        width: clone.width,
        height: clone.height,
        top: coords.y - clone.height / 2,
        left: coords.x - clone.width / 2,
        textType: 'text',
        fill: clone.fill,
      });
      fcanvas.add(clone);
      clone.setCoords();
    } else if (type == 'mark') {
      clone.set({
        ...defaultObjectConfig,
        ...defaultTextConfig,
        width: clone.width,
        height: clone.height,
        top: coords.y - clone.height / 2,
        left: coords.x - clone.width / 2,
        textType: 'mark',
        fill: clone.fill,
      });
      fcanvas.add(clone);
      clone.setCoords();
    }
  });
};

export const addCopiedObject = (coords, fcanvas) => {
  if (!copiedObject) return;
  if (copiedObject.textType == 'mark') {
    copiedObject.clone(clone => {
      clone.set({
        ...defaultObjectConfig,
        ...defaultTextConfig,
        width: clone.width,
        height: clone.height,
        top: coords.y,
        left: coords.x,
        textType: 'mark',
        fill: clone.fill,
      });
      fcanvas.add(clone);
      clone.setCoords();
    });
  } else if (copiedObject.textType == 'text') {
    copiedObject.clone(clone => {
      clone.set({
        ...defaultObjectConfig,
        ...defaultTextConfig,
        width: clone.width,
        height: clone.height,
        top: coords.y,
        left: coords.x,
        textType: 'text',
        fill: clone.fill,
      });
      fcanvas.add(clone);
      clone.setCoords();
    });
  } else {
    copiedObject.clone(clone => {
      clone.set({
        ...defaultObjectConfig,
        width: clone.width,
        height: clone.height,
        top: coords.y,
        left: coords.x,
      });
      fcanvas.add(clone);
      clone.setCoords();
    });
  }
  fcanvas.renderAll();
};

const addImage = (data, dropCoords, fcanvas) => {
  fcanvas.filterBackend = new fabric.WebglFilterBackend();
  let { id, color } = JSON.parse(data);
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
  img.filters.push(
    new fabric.Image.filters.BlendColor({
      color,
      mode: 'tint',
      opacity: 0,
    })
  );
  img.applyFilters();
  fcanvas.add(img);
};

const addText = (dropCoords, fill, fcanvas) => {
  let text = new fabric.Textbox('Text', {
    left: dropCoords.x - defaultTextConfig.width / 2,
    top: dropCoords.y - defaultTextConfig.height / 2,
    textType: 'text',
    ...defaultObjectConfig,
    ...defaultTextConfig,
    fill,
  });
  fcanvas.add(text);
};

const addMark = (dropCoords, fill, fcanvas) => {
  let mark = new fabric.Textbox('1', {
    left: dropCoords.x - defaultTextConfig.width / 2,
    top: dropCoords.y - defaultTextConfig.height / 2,
    textType: 'mark',
    ...defaultObjectConfig,
    ...defaultTextConfig,
    fill,
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

export const zoomOnKeyPress = ({ shouldAddZoomListener, setZoom }) => {
  if (!shouldAddZoomListener) return;
  hotkeys(
    'ctrl+-',
    throttle(
      e => {
        e.preventDefault();
        setZoom(0.9);
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
        setZoom(1.1);
      },
      100,
      { trailing: false }
    )
  );
};

export const copyActiveObject = fcanvas => {
  let obj = fcanvas.getActiveObject();
  copiedObject = obj;
};

export const pasteCopiedObject = (coords, fcanvas) => {
  addCopiedObject(coords, fcanvas);
};

export const removeActiveObject = fcanvas => {
  let obj = fcanvas.getActiveObject();
  fcanvas.remove(obj);
};

export const removeObjectOutsideCanvas = ({ target }, fcanvas) => {
  if (!target.isOnScreen()) {
    fcanvas.remove(target);
  }
};

export const moveObjectWithArrowKeys = ({
  shouldAddMoveListener,
  index,
  moveActiveObject,
}) => {
  if (!shouldAddMoveListener) return;
  document.body.addEventListener('keydown', e => {
    if (e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40) {
      e.preventDefault();
    }
  });
  hotkeys('up', () => moveActiveObject('up'));
  hotkeys('down', () => moveActiveObject('down'));
  hotkeys('left', () => moveActiveObject('left'));
  hotkeys('right', () => moveActiveObject('right'));
};

export const favourite = (fcanvas, { favouriteItem }) => {
  let obj = fcanvas.getActiveObject();
  if (!obj) return;
  if (!obj.textType) return;
  let config = {
    type: obj.textType,
    value: obj.text,
    obj,
  };
  favouriteItem(config);
};

export const changeFont = (fontFamily, fcanvas) => {
  let obj = fcanvas.getActiveObject();
  if (!obj) return;
  if (!obj.textType) return;
  obj.set({
    fontFamily,
  });
  fcanvas.renderAll();
};

export const changeColor = (hex, fcanvas) => {
  console.log(hex);
  let obj = fcanvas.getActiveObject();
  if (!obj) return;
  if (obj.textType) obj.set({ fill: hex });
  else {
    obj.filters.push(
      new fabric.Image.filters.BlendColor({
        color: hex,
        mode: 'tint',
        opacity: 0,
      })
    );
    obj.applyFilters();
  }
  fcanvas.renderAll();
};

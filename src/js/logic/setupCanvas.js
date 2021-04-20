import { fabric } from 'fabric-with-gestures';

export const createCanvas = (id, canvasData) => {
  let { getFCanvases, addCanvas, index, src, height, width } = canvasData;

  console.log({ id, src });
  let fcanvas = new fabric.Canvas(id);

  fcanvas.setDimensions({
    width,
    height,
  });

  configureBackgroundImage(src, fcanvas, width, height);
  setDefaultProperties(fcanvas, { width, height });
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

const setDefaultProperties = (fcanvas, props) => {
  const { width, height } = props;
  fcanvas.originalDimensions = { width, height };
};

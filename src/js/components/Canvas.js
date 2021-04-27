import React, { useState, useEffect, useLayoutEffect } from 'react';
import { createCanvas } from './../logic/setupCanvas';

import ContextMenu from './ContextMenu';

const Canvas = ({
  src,
  index,
  addCanvas,
  getFCanvases,
  setZoom,
  length,
  updateMarks,
  getMarks,
  setActiveCanvas,
  copy,
  paste,
  remove,
  moveActiveObject,
  addToQuickAccess,
  favouriteItem,
  updateDefaultTextOptions,
}) => {
  const [showMenu, setShowMenu] = useState({
    show: false,
    properties: 'transform',
    pasteCoords: { x: 0, y: 0 },
  });

  useLayoutEffect(() => {
    document.querySelector(
      `.canvas__container--${index}`
    ).innerHTML = `<canvas className="canvas" id="canvas-${index}"></canvas>`;
    let canvasData = {
      getFCanvases,
      addCanvas,
      index,
      src,
      setZoom,
      setShowMenu,
      shouldAddEventListeners: index == length - 1,
      updateMarks,
      getMarks,
      setActiveCanvas,
      copy,
      paste,
      moveActiveObject,
      favouriteItem,
      updateDefaultTextOptions,
    };
    let img = new Image();
    img.src = src;
    img.addEventListener('load', () =>
      createCanvas(`canvas-${index}`, {
        ...canvasData,
        width: img.width,
        height: img.height,
      })
    );
  }, []);

  const updateShowMenu = config => [setShowMenu({ ...showMenu, ...config })];

  const getCoords = e => {
    let wrapper = document.querySelector(`.canvas__container--${index}`);
    let relativeCoords = {
      x: wrapper.getBoundingClientRect().left + window.scrollX,
      y: wrapper.getBoundingClientRect().top + window.scrollY,
    };
    let absoluteCoords = {
      x: e.pageX,
      y: e.pageY,
    };
    let dropCoords = {
      x: absoluteCoords.x - relativeCoords.x,
      y: absoluteCoords.y - relativeCoords.y,
    };
    return dropCoords;
  };

  return (
    <>
      <ContextMenu
        show={showMenu.show}
        coordinates={{ x: showMenu.x, y: showMenu.y }}
        index={index}
        properties={showMenu.properties}
        updateShowMenu={updateShowMenu}
        index={index}
        copy={copy}
        paste={paste}
        pasteCoords={showMenu.pasteCoords}
        remove={remove}
        addToQuickAccess={addToQuickAccess}
      />
      <div
        className="canvas__wrapper"
        onClick={() => {
          // setShowMenu(null);
          updateShowMenu({ show: false });
        }}
        onContextMenu={e => {
          e.preventDefault();
          setShowMenu({
            show: true,
            x: e.pageX,
            y: e.pageY,
            properties: showMenu.show ? 'all' : 'transform',
            pasteCoords: getCoords(e),
          });
          setActiveCanvas(index);
        }}
      >
        <div
          className={`canvas__container canvas__container--${index}`}
          onDragOver={e => e.preventDefault()}
          onDragEnter={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
          }}
        >
          {/*  CANVAS IS INSERTED DYNAMICALLY BU USELAYOUTEFFECT HOOK */}
        </div>
      </div>
      <br />
    </>
  );
};

export default Canvas;

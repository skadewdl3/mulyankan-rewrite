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
    show: false, // Context Menu is visible or not
    properties: 'transform', // Property to transition smoothly
    pasteCoords: { x: 0, y: 0 }, // Coordinate (pageX, pageY) at which menu is shown
  });

  useLayoutEffect(() => {
    document.querySelector(
      `.canvas__container--${index}`
    ).innerHTML = `<canvas className="canvas" id="canvas-${index}"></canvas>`;

    // Methods required for initialising Fabric.js canvas and event listeners
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

    // Load image from dataurl and render it to Fabric.js canvas when image is loaded
    let img = new Image();
    img.src = src;
    img.addEventListener('load', () => {
      createCanvas(`canvas-${index}`, {
        ...canvasData,
        width: img.width,
        height: img.height,
      });
    });
  }, []);

  const updateShowMenu = config => [setShowMenu({ ...showMenu, ...config })];

  // Uses some complicated math stuff to calculate context menu coordinates
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
          updateShowMenu({ show: false });
        }}
        onContextMenu={e => {
          e.preventDefault();
          setShowMenu({
            show: true,
            x: e.pageX,
            y: e.pageY,
            properties: showMenu.show ? 'all' : 'transform', // Smoothly moves menu to new coordinates if it is already open
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
          {/*  Canvas is inserted dynamically using useLayoutEffect hook (useful in initialising Fabric.js canvas beforrehand) */}
        </div>
      </div>
      <br />
    </>
  );
};

export default Canvas;

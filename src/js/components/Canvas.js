import React, { useState, useEffect, useLayoutEffect } from 'react';
import { createCanvas } from './../logic/setupCanvas';
// import ContextMenu from './ContextMenu';

const Canvas = ({ src, index, addCanvas, getFCanvases }) => {
  const [showMenu, setShowMenu] = useState(false);

  useLayoutEffect(() => {
    document.querySelector(
      `.canvas__container--${index}`
    ).innerHTML = `<canvas className="canvas" id="canvas-${index}"></canvas>`;
    let canvasData = {
      getFCanvases,
      addCanvas,
      index,
      src,
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

  const getDropCoords = e => {
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
      {/* <ContextMenu
        show={showMenu ? true : false}
        coordinates={showMenu ? { x: showMenu.x, y: showMenu.y } : null}
        dropCoords={showMenu ? showMenu.dropCoords : null}
        index={index}
        setShowMenu={setShowMenu}
      /> */}
      <div
        className={`canvas__wrapper`}
        // style={{
        //   width: fcanvases[index] ? fcanvases[index].width : background.width,
        //   height: fcanvases[index]
        //     ? fcanvases[index].height
        //     : background.height,
        //   marginTop: showMenu ? '1rem' : '1rem',
        // }}
        onClick={() => setShowMenu(null)}
        onContextMenu={e => {
          e.preventDefault();
          setActiveCanvas(index);
          setShowMenu({
            x: e.clientX,
            y: e.clientY,
            dropCoords: getDropCoords(e),
          });
        }}
      >
        <div
          className={`canvas__container canvas__container--${index}`}
          onDragOver={e => e.preventDefault()}
          onDragEnter={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            let dropCoords = getDropCoords(e);
            let type = e.dataTransfer.getData('type');
            let image = e.dataTransfer.getData('image');
            // addObjects(
            //   {
            //     type,
            //     image,
            //     dropCoords,
            //     index,
            //     markData: {
            //       marks,
            //       total: document.querySelector('.quickmarking__total')
            //         ? document.querySelector('.quickmarking__total').value
            //         : 'Total',
            //     },
            //   },
            //   getFCanvases,
            //   setFCanvases
            // );
          }}
        >
          {/*  CANVAS IS INSERTED DYNAMICALLY BU USELAYOUTEFFECT HOOK */}
        </div>
      </div>
    </>
  );
};

export default Canvas;

import React, { useState, useEffect } from 'react';
import {
  CopyOutlined,
  FormOutlined,
  DeleteOutlined,
  HeartOutlined,
} from '@ant-design/icons';

const ContextMenu = ({
  show,
  coordinates,
  updateShowMenu,
  properties,
  index,
  copy,
  paste,
  pasteCoords,
  remove,
  addToQuickAccess,
}) => {
  // zIndex property to show/hide context menu
  const [zIndex, setZIndex] = useState(-1);

  // Show menu by changing zIndex if show === true
  useEffect(() => {
    if (show) {
      setZIndex(100);
    } else {
      setZIndex(-1);
    }
  }, [show]);

  return (
    <div
      className="contextmenu"
      style={{
        zIndex,
        top: coordinates.y,
        left: coordinates.x,
        transform: show ? 'scale(1)' : 'scale(0)', // Show scale transition if context menu is opening
        /*
        There can be two cases for opening context menu:
        1. Context menu is newly opened --> Only animate transform (scale) property
        
        2. Context menu is already open and user right-clicks elsewhere on canvas --> smoothly move context menu to that position by animating all properties (top, left)
        */
        transition: `${properties} .2s ease-out`,
        transformOrigin: '0 0',
      }}
    >
      <div
        className="contextmenu__item"
        onClick={() => {
          copy(index);
          updateShowMenu({ show: false });
        }}
      >
        <CopyOutlined />
        <span className="contextmenu__text">Copy</span>
      </div>
      <div
        className="contextmenu__item"
        onClick={e => {
          /*
          pasteCoords are coordinates of opening context menu
          because object should be pasted where context menu is opened
          */

          paste(index, pasteCoords);
          updateShowMenu({ show: false });
        }}
      >
        <FormOutlined />
        <span className="contextmenu__text">Paste</span>
      </div>
      <div
        className="contextmenu__item"
        onClick={() => {
          remove(index);
          updateShowMenu({ show: false });
        }}
      >
        <DeleteOutlined />
        <span className="contextmenu__text">Remove</span>
      </div>
      <div
        className="contextmenu__item"
        onClick={() => {
          addToQuickAccess(index);
          updateShowMenu({ show: false });
        }}
      >
        <HeartOutlined />
        <span className="contextmenu__text">Favourite</span>
      </div>
    </div>
  );
};

export default ContextMenu;

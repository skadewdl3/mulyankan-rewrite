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
  const [zIndex, setZIndex] = useState(-1);

  useEffect(() => {
    let prev;
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
        transform: show ? 'scale(1)' : 'scale(0)',
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
      {/* <div className="contextmenu__item">
        <DeleteOutlined />
        <span className="contextmenu__text">Remove</span>
      </div> */}
    </div>
  );
};

export default ContextMenu;

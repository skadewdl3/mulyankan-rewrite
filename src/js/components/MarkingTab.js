import React, { useState } from 'react';
import { chunk } from 'lodash';
import {
  FontSizeOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
const MarkingTab = ({
  symbols,
  marks,
  quickAccess,
  removeFromFavourites,
  colors,
  color,
  setColor,
}) => {
  return (
    <>
      <div className="controls__left__header">Quick Marking</div>
      <div
        className="quickmarking__wrapper"
        onDragStart={e => {
          e.dataTransfer.setData('type', 'automark');
        }}
        draggable="true"
      >
        <div
          className="quickmarking__marks"
          onDragStart={e => {
            e.dataTransfer.setData('type', 'automark');
          }}
          draggable="true"
        >
          {marks}
        </div>
        <span
          className="quickmarking__text"
          onDragStart={e => {
            e.dataTransfer.setData('type', 'automark');
          }}
          draggable="true"
        >
          out of
        </span>
        <input
          type="text"
          className="quickmarking__total"
          onDragStart={e => {
            e.dataTransfer.setData('type', 'automark');
          }}
          draggable="true"
        />
      </div>
      <div className="controls__left__divider"></div>
      <div className="controls__left__header">Symbols</div>
      <div className="controls__tab--symbols">
        {chunk(symbols, 3).map((arr, i) => (
          <div className="symbols__grid" key={i}>
            {arr.map((cur, j) => (
              <div
                className="symbols__image__wrapper"
                key={j}
                onDragStart={e => {
                  console.log(cur);
                  e.dataTransfer.setData(
                    'image',
                    JSON.stringify({
                      id: cur,
                      color: colors.find(clr => clr.name == color).hex,
                    })
                  );
                  e.dataTransfer.setData('type', 'image');
                }}
                draggable="true"
              >
                <img
                  src={`./images/${cur}.svg`}
                  alt=""
                  className={`symbols__image symbols__${cur} symbols__image--${color}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="controls__color-picker">
        {colors.map(clr => (
          <div
            key={`color-${clr.name}`}
            className="controls__color"
            style={{
              backgroundColor: color == clr.name ? '#fff' : clr.hex,
              border:
                color == clr.name
                  ? `solid .5rem ${clr.hex}`
                  : `solid 0rem #fff`,
            }}
            onClick={() => setColor(clr)}
          ></div>
        ))}
      </div>
      <div className="controls__left__divider"></div>
      <div className="controls__left__header">Favourites</div>
      <div className="controls__left__divider"></div>
      <div className="controls__favourites">
        {quickAccess.length == 0 ? (
          <div className="controls__favourites__message">
            <span>No favourites added yet.</span>
          </div>
        ) : (
          quickAccess.map((cur, index) => {
            return (
              <div
                className="controls__favourites__item"
                key={index}
                draggable="true"
                onDragStart={e => {
                  console.log(cur);
                  e.dataTransfer.setData('favourite', true);
                  e.dataTransfer.setData('type', cur.type);
                  e.dataTransfer.setData(
                    'content',
                    JSON.stringify({ obj: cur.obj })
                  );
                }}
              >
                <div
                  className={`controls__favourites__item__icon controls__favourites__item__icon--${cur.type}`}
                >
                  {cur.type == 'mark' ? (
                    <CheckCircleOutlined />
                  ) : (
                    <FontSizeOutlined />
                  )}
                </div>
                <div className="controls__favourites__item__value">
                  {cur.value.substring(0, 60).length == cur.value.length
                    ? cur.value
                    : `${cur.value.substring(0, 60)}...`}
                </div>
                <button
                  className="controls__favourites__item__delete"
                  onClick={() => {
                    removeFromFavourites(index);
                  }}
                >
                  <DeleteOutlined />
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default MarkingTab;

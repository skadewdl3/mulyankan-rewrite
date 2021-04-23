import React from 'react';
import { chunk } from 'lodash';
import {
  FontSizeOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
const MarkingTab = ({ symbols, marks, quickAccess, removeFromFavourites }) => {
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
                  e.dataTransfer.setData('image', cur);
                  e.dataTransfer.setData('type', 'image');
                }}
                draggable="true"
              >
                <img
                  src={`./images/${cur}.svg`}
                  alt=""
                  className={`symbols__image symbols__${cur}`}
                />
              </div>
            ))}
          </div>
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

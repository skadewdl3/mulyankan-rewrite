import React from 'react';
import { chunk } from 'lodash';

const MarkingTab = ({ symbols }) => {
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
          {/*Dyanamically Change Marks here*/}
          10
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
      <div className="controls__tab controls__tab--symbols">
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
      <div className="controls__left__header">Clipboard</div>
    </>
  );
};

export default MarkingTab;

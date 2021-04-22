import React from 'react';

const MarkingTab = () => {
  return (
    <>
      <div className="controls__left__header">Textboxes</div>
      <div className="controls__left__divider controls__left__divider--hidden"></div>
      <div className="symbols__text">
        <div
          className="symbols__text__wrapper"
          onDragStart={e => {
            e.dataTransfer.setData('type', 'text');
          }}
          draggable="true"
        >
          <img
            src="./images/textbox.svg"
            alt="textbox"
            className="symbols__text__icon"
            draggable="true"
            onDragStart={e => {
              e.dataTransfer.setData('type', 'text');
            }}
          />
          <div
            className="symbols__text__text"
            draggable="true"
            onDragStart={e => {
              e.dataTransfer.setData('type', 'text');
            }}
          >
            Textbox
          </div>
        </div>
        <div
          className="symbols__text__wrapper"
          draggable="true"
          onDragStart={e => {
            e.dataTransfer.setData('type', 'mark');
          }}
        >
          <img
            src="./images/markbox.svg"
            alt="markbox"
            className="symbols__text__icon"
            draggable="true"
            onDragStart={e => {
              e.dataTransfer.setData('type', 'mark');
            }}
          />
          <div
            className="symbols__text__text"
            draggable="true"
            onDragStart={e => {
              e.dataTransfer.setData('type', 'mark');
            }}
          >
            Markbox
          </div>
        </div>
      </div>
      <div className="controls__left__divider controls__left__divider--hidden"></div>
      {/* <div className="controls__left__header">Text Editing</div> */}
      <div className="controls__left__divider controls__left__divider--hidden"></div>
      {/* {chunk(symbols, 3).map((arr, i) => (
          <div className="symbols__grid" key={i}>
            {arr.map((cur, j) => (
              <div
                className="symbols__image__wrapper"
                key={j}
                onDragStart={e => {
                  e.dataTransfer.setData('image', cur);
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
        ))} */}
    </>
  );
};

export default MarkingTab;

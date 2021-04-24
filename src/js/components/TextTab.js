import React, { useState, useEffect } from 'react';
import GoogleFontLoader from 'react-google-font-loader';

const MarkingTab = ({ changeFont, defaultFontOption }) => {
  const [activeFontIndex, setActiveFontIndex] = useState(1);

  const fontNames = [
    { name: 'Professional', font: 'Source Serif Pro' },
    { name: 'Modern', font: 'Roboto' },
    { name: 'Casual', font: 'Open Sans' },
    { name: 'Handwritten', font: 'Gochi Hand' },
    { name: 'Cursive', font: 'Dancing Script' },
  ];

  const fonts = fontNames.map(({ font }) => {
    return {
      font,
      weights: [400],
    };
  });

  useEffect(() => {
    changeFont(fontNames[activeFontIndex].font);
  }, [activeFontIndex]);

  useEffect(() => {
    let index = fontNames.indexOf(
      fontNames.filter(cur => cur.font == defaultFontOption)[0]
    );
    setActiveFontIndex(index);
  }, [defaultFontOption]);

  return (
    <>
      <GoogleFontLoader fonts={fonts} />
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
      <div className="controls__left__header">Font Family</div>
      <div className="controls__left__divider controls__left__divider--hidden"></div>
      <div className="controls__families">
        {fontNames.map((cur, index) => (
          <div
            className="controls__family"
            onClick={() => setActiveFontIndex(index)}
            key={Math.random()}
          >
            <span
              className={`controls__family-indicator ${
                index == activeFontIndex
                  ? 'controls__family-indicator--active'
                  : ''
              }`}
            ></span>
            <p style={{ fontFamily: cur.font }}>{cur.name}</p>
          </div>
        ))}
      </div>
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

import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import GoogleFontLoader from 'react-google-font-loader';

const MarkingTab = ({
  changeText,
  defaultFontOption,
  color,
  setColor,
  colors,
  defaultFontStyles,
}) => {
  const [activeFontIndex, setActiveFontIndex] = useState(1);

  const fontNames = [
    { name: 'Professional', font: 'Source Serif Pro' },
    { name: 'Modern', font: 'Roboto' },
    { name: 'Casual', font: 'Open Sans' },
    { name: 'Handwritten', font: 'Gochi Hand' },
    { name: 'Cursive', font: 'Dancing Script' },
  ];

  const fontStyles = [
    { name: 'Bold', icon: <BoldOutlined />, id: 'bold' },
    { name: 'Italic', icon: <ItalicOutlined />, id: 'italic' },
    { name: 'Underline', icon: <UnderlineOutlined />, id: 'underline' },
  ];

  const fonts = fontNames.map(({ font }) => {
    return {
      font,
      weights: [400],
    };
  });

  useEffect(() => {
    changeText({
      font: fontNames[activeFontIndex].font,
    });
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
            e.dataTransfer.setData(
              'fill',
              colors.find(clr => clr.name == color).hex
            );
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
              e.dataTransfer.setData(
                'fill',
                colors.find(clr => clr.name == color).hex
              );
            }}
          />
          <div
            className="symbols__text__text"
            draggable="true"
            onDragStart={e => {
              e.dataTransfer.setData('type', 'text');
              e.dataTransfer.setData(
                'fill',
                colors.find(clr => clr.name == color).hex
              );
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
            e.dataTransfer.setData(
              'fill',
              colors.find(clr => clr.name == color).hex
            );
          }}
        >
          <img
            src="./images/markbox.svg"
            alt="markbox"
            className="symbols__text__icon"
            draggable="true"
            onDragStart={e => {
              e.dataTransfer.setData('type', 'mark');
              e.dataTransfer.setData(
                'fill',
                colors.find(clr => clr.name == color).hex
              );
            }}
          />
          <div
            className="symbols__text__text"
            draggable="true"
            onDragStart={e => {
              e.dataTransfer.setData('type', 'mark');
              e.dataTransfer.setData(
                'fill',
                colors.find(clr => clr.name == color).hex
              );
            }}
          >
            Markbox
          </div>
        </div>
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
      <div className="controls__left__divider controls__left__divider--hidden"></div>
      <div className="controls__left__header">Font Style</div>
      <div className="controls__left__divider controls__left__divider--hidden"></div>
      <div className="controls__fontstyles">
        {fontStyles.map(style => (
          <div
            key={style.name}
            className={`controls__fontstyle ${
              defaultFontStyles[style.id] ? 'controls__fontstyle--active' : ''
            }`}
            onClick={() =>
              changeText({ [style.id]: !defaultFontStyles[style.id] })
            }
          >
            <div className="controls__fontstyle__icon">{style.icon}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MarkingTab;

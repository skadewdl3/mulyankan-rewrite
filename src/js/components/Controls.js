import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { chunk } from 'lodash';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import MarkingTab from './MarkingTab';
import TextTab from './TextTab';

const Controls = ({
  setFCanvases,
  setFiles,
  setFileName,
  fileName,
  setZoom,
  marks,
  setDownloading,
  quickAccess,
  removeFromFavourites,
  setPreprocess,
  changeText,
  defaultTextOptions,
  color,
  setColor,
}) => {
  const [tab, setTab] = useState('marking');
  const colors = [
    { name: 'red', hex: '#ff0000' },
    { name: 'purple', hex: '#6c5ce7' },
    { name: 'green', hex: '#16a085' },
    { name: 'pink', hex: '#e84393' },
  ];

  useEffect(() => {
    console.log(color);
    window.localStorage.setItem('color', color);
  }, [color]);

  useEffect(() => {
    document.querySelectorAll('.controls__tab').forEach(cur => {
      if (cur.classList.contains(`controls__tab--${tab}`)) {
        if (document.querySelector('.controls__tab--active')) {
          document
            .querySelector('.controls__tab--active')
            .classList.remove('controls__tab--active');
        }
        cur.classList.add('controls__tab--active');
      }
    });
  }, [tab]);

  useEffect(() => {
    const tabs = document.querySelector('.controls__tabs').childNodes;
    tabs.forEach((cur, index, arr) => {
      cur.style.width = `calc(100% - ${arr.length}%)`;
    });
    setFileName(fileName);
  }, []);

  let symbols = [
    'check',
    'circle',
    'cross',
    'underline',
    'double-underline',
    'arrow',
  ];

  const debouncedSearch = debounce(val => {
    setFileName(val);
  }, 500);

  return (
    <>
      <div style={{ display: 'none', zIndex: -1 }}>
        {chunk(symbols, 3).map((arr, i) => (
          <div className="symbols-cp__grid" key={i}>
            {arr.map((cur, j) => (
              <div
                className="symbols-cp__image__wrapper"
                key={j}
                onDragStart={e => {
                  e.dataTransfer.setData('image', cur);
                  e.dataTransfer.setData('type', 'image');
                }}
                draggable="true"
              >
                <img
                  src={`./images/${cur}.svg`}
                  alt=""
                  className={`symbols-cp__image symbols-cp__${cur}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="controls__top">
        <div className="controls__top--left">
          <button
            className="controls__btn"
            onClick={() => {
              setFCanvases([]);
              setPreprocess([]);
              setFiles([]);
              setFileName('Document');
            }}
          >
            <ArrowLeftOutlined style={{ margin: '0 1rem' }} />
          </button>
          <div className="controls__top__vertical-divider"></div>
          <input
            className="controls__top__filename"
            defaultValue={fileName}
            onChange={e => {
              e.target.style.width = `${e.target.value.length + 1}ch`;
              debouncedSearch(e.target.value.trim());
            }}
          />
        </div>
        <div className="controls__top--center"></div>
        <div className="controls__top--right">
          <button
            className="controls__btn"
            onClick={() => {
              // zoomIn
              setZoom(1.1);
            }}
          >
            <span>Zoom In</span>
            <ZoomInOutlined style={{ margin: '0 1rem' }} />
          </button>
          <button
            className="controls__btn"
            onClick={() => {
              // zoomOut
              setZoom(0.9);
            }}
          >
            <span>Zoom Out</span>
            <ZoomOutOutlined style={{ margin: '0 1rem' }} />
          </button>
          <button
            className="controls__btn"
            onClick={() => {
              // zoomReset
              setZoom(1.1, true);
            }}
          >
            <span>Reset Zoom</span>
            <SearchOutlined style={{ margin: '0 1rem' }} />
          </button>
          <button
            className="controls__btn controls__download"
            onClick={() => {
              setDownloading(true);
            }}
          >
            <span>Download</span>
            <DownloadOutlined style={{ margin: '0 1rem' }} />
          </button>
        </div>
      </div>
      <div className="controls__left">
        <div className="controls__tabs">
          <div
            className="controls__tab controls__tab--marking"
            onClick={() => setTab('marking')}
          >
            <CheckCircleOutlined className="controls__tab__icon" />
            <span className="controls__tab__text">Marking</span>
          </div>
          <div
            className="controls__tab controls__tab--text"
            onClick={() => setTab('text')}
          >
            <EditOutlined className="controls__tab__icon" />
            <span className="controls__tab__text">Text</span>
          </div>
        </div>

        {tab == 'marking' && (
          <MarkingTab
            symbols={symbols}
            marks={marks}
            quickAccess={quickAccess}
            removeFromFavourites={removeFromFavourites}
            colors={colors}
            setColor={setColor}
            color={color}
          />
        )}
        {tab == 'text' && (
          <TextTab
            changeText={changeText}
            defaultFontOption={defaultTextOptions.font}
            defaultFontStyles={{
              bold: defaultTextOptions.bold,
              italic: defaultTextOptions.italic,
              underline: defaultTextOptions.underline,
              superscript: defaultTextOptions.superscript,
              subscript: defaultTextOptions.subscript,
            }}
            colors={colors}
            setColor={setColor}
            color={color}
          />
        )}
      </div>
    </>
  );
};

export default Controls;

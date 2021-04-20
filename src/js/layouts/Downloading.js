import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { randomFact } from './../logic/loadingFacts';
import { ArrowLeftOutlined } from '@ant-design/icons';

const Downloading = ({
  isOpen,
  setIsOpen,
  setZoom,
  getFCanvases,
  fileName,
  setFileName,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [dropdown, setDropdown] = useState(false);
  const [fact, setFact] = useState('');
  const [downloadData, setDownloadData] = useState('');
  const [downloading, setDownloading] = useState(false);

  const setRandomFact = async () => {
    let res = await randomFact();
    res.data
      ? res.data.fact
        ? setFact(res.data.fact)
        : setFact(res.data)
      : setFact(res);
  };

  useEffect(() => {
    if (isOpen) {
      setRandomFact();
      setShouldRender(true);
      console.log(isOpen);
    }
    if (!isOpen) {
      setFact('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (downloadData !== '') {
      if (document.querySelector('.downloading__options__item')) {
        if (document.querySelector('.downloading__options__item--active')) {
          document
            .querySelector('.downloading__options__item--active')
            .classList.remove('downloading__options__item--active');
        }
        document
          .querySelector(`.downloading__options__item--${downloadData}`)
          .classList.add('downloading__options__item--active');
      }
    } else {
      if (document.querySelector('.downloading__options__item--active')) {
        document
          .querySelector('.downloading__options__item--active')
          .classList.remove('downloading__options__item--active');
      }
    }
  }, [downloadData]);

  const onAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  const updateFileName = debounce(val => {
    setFileName(val);
  }, 500);

  return (
    <>
      {shouldRender && (
        <>
          <div
            className="downloading"
            style={{ animation: `${isOpen ? 'fadeIn' : 'fadeOut'} 0.5s` }}
            onAnimationEnd={onAnimationEnd}
            onClick={e => {
              let els = [];
              let a = e.target;
              while (a) {
                if (!a.classList) break;
                Array.from(a.classList, cur => els.push(cur));
                a = a.parentNode;
              }
              if (els.includes('downloading__dropdown')) return;
              if (dropdown) setDropdown(false);
            }}
          >
            <div className="generic__wrapper downloading__wrapper">
              <div
                className="generic__nav downloading__nav"
                onClick={() => setIsOpen(false)}
                onMouseOver={() => {
                  document
                    .querySelector('.downloading__back__icon')
                    .classList.add('generic__back__icon--animated');
                  setTimeout(
                    () =>
                      document
                        .querySelector('.downloading__back__icon')
                        .classList.remove('generic__back__icon--animated'),
                    100
                  );
                }}
              >
                <ArrowLeftOutlined
                  style={{ fontSize: '3rem', margin: '0 1rem' }}
                  className="downloading__back__icon"
                />
                <span>Download</span>
              </div>
              <br />
              <img
                src="./images/download.jpg"
                alt="Downloading"
                className="downloading__image"
              />
              {/* <div className="downloading__message">
                {fact !== '' && <strong>Factoid:</strong>} {fact}
              </div> */}
              {!downloading && (
                <>
                  <div className="downloading__message">Enter File Name</div>
                  <div className="downloading__input">
                    <input
                      type="text"
                      className="downloading__file-name"
                      onInput={e => {
                        e.target.style.width = `${e.target.value.length + 1}ch`;
                      }}
                      defaultValue={fileName}
                      onChange={e => {
                        updateFileName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="downloading__message">
                    Select Download Method
                  </div>
                  <div className="downloading__options">
                    <div
                      className="downloading__options__item downloading__options__item--pdf"
                      onClick={() => {
                        setDownloadData('pdf');
                      }}
                    >
                      <div className="downloading__options__item__icon">
                        <i className="fa fa-icon fa-file-pdf-o"></i>
                      </div>
                      <div className="downloading__options__item__text">
                        <div className="downloading__options__item__text__title">
                          PDF
                        </div>
                        <div className="downloading__options__item__text__subtitle">
                          All done and ready to export? Pick me!
                        </div>
                      </div>
                    </div>
                    <div
                      className="downloading__options__item  downloading__options__item--json"
                      onClick={() => {
                        setDownloadData('json');
                      }}
                    >
                      <div className="downloading__options__item__icon">
                        <i className="fa fa-icon fa-file-archive-o"></i>
                      </div>
                      <div className="downloading__options__item__text">
                        <div className="downloading__options__item__text__title">
                          JSON
                        </div>
                        <div className="downloading__options__item__text__subtitle">
                          Wanna work on your document later? Pick Me!
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="downloading__cta-wrapper">
                    <button
                      className="downloading__cta"
                      onClick={() => {
                        if (downloadData == 'json') {
                          setDownloading(true);
                          setZoom(1);
                          var json = { fcanvases };
                          var data =
                            'text/json;charset=utf-8,' +
                            encodeURIComponent(JSON.stringify(json));

                          var a = document.createElement('a');
                          a.href = 'data:' + data;
                          a.download = `${fileName}.json`;

                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          setDownloading(false);
                        } else {
                          setDownloading(true);
                          setZoom(1);
                          let urls = [];
                          fcanvases.forEach(({ url }) =>
                            urls.push({
                              url,
                            })
                          );
                          // downloadPDF(
                          //   urls,
                          //   fileName,
                          //   () => {
                          //     setDownloadData('');
                          //     setDownloading(false);
                          //   },
                          //   'https://mulyankan.herokuapp.com/download'
                          // );
                        }
                      }}
                    >
                      Download
                    </button>
                  </div>
                </>
              )}
              {downloading && (
                <>
                  <div className="downloading__sub-message">
                    Hang tight! We're putting your document together.
                  </div>
                  <div className="downloading__message">
                    {fact !== '' && <strong>Factoid:</strong>} {fact}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Downloading;

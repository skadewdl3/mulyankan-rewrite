import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { chunk } from 'lodash';
import pretty from 'prettysize';
import {
  ArrowLeftOutlined,
  CloseOutlined,
  FilePdfOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { convertFiles } from '../logic/convertFiles';

const FileUpload = ({
  setFcanvases,
  setLoading,
  setPreprocess,
  setFileName,
}) => {
  const chunkSize = 6;

  const [files, setFiles] = useState([]);
  const [shouldPreprocess, setShouldPreprocess] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false, 'Just a sec. Cleaning up...');
    }, 3000);
  }, []);

  const updateFiles = filesArr => {
    let newArr = [];
    files.forEach(arr => arr.forEach(cur => newArr.push(cur)));
    newArr = [...newArr, ...filesArr];
    let newFilesArr = chunk(newArr, chunkSize);
    setFiles(newFilesArr);
  };

  const removeFile = (i, j) => {
    let newArr = [];
    files.forEach((arr, n) =>
      arr.forEach((cur, index) => {
        if (i === n && j === index) {
          return;
        } else {
          newArr.push(cur);
        }
      })
    );
    let newFilesArr = chunk(newArr, chunkSize);
    setFiles(newFilesArr);
  };

  const uploadFiles = async () => {
    setLoading(true);
    let newArr = [];
    files.forEach(arr => arr.forEach(cur => newArr.push(cur)));

    const postProcessing = res => {
      if (shouldPreprocess) {
        setPreprocess(res.reverse());
      } else {
        setFcanvases(res.reverse());
      }
      setFileName(files[0].name);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    setTimeout(() => {
      convertFiles(newArr, postProcessing).catch(err => {
        console.log(err);
      });
    }, 2000);

    // let res = await convertFiles(files).catch(err => console.log(err));
    // setTimeout(() => {
    //   setLoading(false);
    // }, 1000);
    // console.log(res.data);

    // if (shouldPreprocess) {
    //   setPreprocess(res.data.reverse());
    // } else {
    //   setFcanvases(res.data.reverse());
    // }
  };

  return (
    <>
      <div className="file__wrapper">
        <input
          type="file"
          style={{ display: 'none' }}
          name="pdf"
          className="file-input"
          accept="application/pdf, image/png, image/jpg, image/jfif, image/webp, image/jpeg"
          onChange={e => {
            updateFiles(e.target.files);
          }}
          multiple
        />
        <Link to="/" className="file__back" style={{ display: 'none' }} />
        <div className="generic__wrapper">
          <div
            className="generic__nav"
            onClick={() => document.querySelector('.file__back').click()}
            onMouseOver={() => {
              document
                .querySelector('.file__back__icon')
                .classList.add('generic__back__icon--animated');
              setTimeout(
                () =>
                  document
                    .querySelector('.file__back__icon')
                    .classList.remove('generic__back__icon--animated'),
                100
              );
            }}
          >
            <ArrowLeftOutlined
              style={{ fontSize: '3rem', margin: '0 1rem' }}
              className="file__back__icon"
            />

            <span>Select Files</span>
          </div>
        </div>
        <div className="generic__container">
          <div className="file__container">
            <button
              className="file__container__cta"
              onClick={() => document.querySelector('.file-input').click()}
            >
              Select Files
            </button>
          </div>

          <div className="file__preview">
            {files[0] &&
              files.map((arr, i) => (
                <div
                  className="file__preview__grid"
                  style={{ gridTemplateColumns: '1fr '.repeat(chunkSize) }}
                  key={i}
                >
                  {arr.map((cur, index) => (
                    <div
                      className="file__item"
                      key={index}
                      onMouseOver={() => {
                        document.querySelector(
                          `.file__item__delete--${i}-${index}`
                        ).style.opacity = 1;
                      }}
                      onMouseLeave={() => {
                        document.querySelector(
                          `.file__item__delete--${i}-${index}`
                        ).style.opacity = 0;
                      }}
                    >
                      <div
                        className={`file__item__delete file__item__delete--${i}-${index}`}
                        onClick={() => removeFile(i, index)}
                      >
                        <CloseOutlined />
                      </div>
                      <div className="file__item__icon">
                        {cur.type.endsWith('pdf') ? (
                          <FilePdfOutlined
                            style={{ fontSize: '3.5rem', marginBottom: '1rem' }}
                          />
                        ) : (
                          <FileImageOutlined
                            style={{ fontSize: '3.5rem', marginBottom: '1rem' }}
                          />
                        )}
                      </div>

                      <div className="file__item__name">{`${cur.name.substring(
                        0,
                        10
                      )}${
                        cur.name.substring(0, 15).length < cur.name.length
                          ? '...'
                          : ''
                      }`}</div>
                      <div className="file__item__size">{pretty(cur.size)}</div>
                    </div>
                  ))}
                </div>
              ))}

            {!files[0] && (
              <span className="file__preview__message">
                Selected files will appear here.
              </span>
            )}
          </div>
          {files[0] && (
            <div className="file__checkbox__container">
              <div
                className="file__checkbox__wrapper"
                onClick={() => setShouldPreprocess(!shouldPreprocess)}
              >
                <div className="file__checkbox__box">
                  <img
                    className={`file__checkbox__img ${
                      shouldPreprocess ? 'file__checkbox__img--visible' : ''
                    }`}
                    src="./images/checkbox-check.svg"
                    alt="check"
                  />
                </div>
                <div className="file__checkbox__text">
                  I want to rotate/reorder files.
                </div>
              </div>
            </div>
          )}
          <div className="file__proceed__container">
            {files[0] && (
              <>
                <button
                  className="file__proceed__btn"
                  onClick={() => {
                    uploadFiles();
                    if (files.length == 0) return;
                    else {
                      let name = files[0][0].name.replace(/\.[^/.]+$/, '');
                      setFileName(name);
                    }
                  }}
                >
                  <span>Proceed</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(FileUpload);

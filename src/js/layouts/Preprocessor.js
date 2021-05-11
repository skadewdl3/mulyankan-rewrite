import React, { useEffect, useState } from 'react';
import ImageRotation from 'image-rotation';
import {
  UpOutlined,
  DownOutlined,
  DeleteOutlined,
  RotateRightOutlined,
  RotateLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const Preprocessor = ({
  data,
  setFabricCanvases,
  setPreprocess,
  setLoading,
}) => {
  const [canvases, setCanvases] = useState(data);

  useEffect(() => {
    canvases.forEach((src, i) => {
      let canvas = document.querySelector(`.preprocess__canvas--${i}`);
      let img = document.createElement('img');
      let canvasContext = canvas.getContext('2d');
      img.src = src;
      img.addEventListener('load', () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(img, 0, 0);
      });
    });
  }, [canvases]);

  const rotate = (imgData, all = false) => {
    if (all) {
      let newArr = [];
      canvases.forEach((cur, i) => {
        let imageRotate = new ImageRotation(cur, { quality: 1 });
        imageRotate.generate(imgData.angle, 'image/png').then(res => {
          let img = new Image();
          img.src = res;
          img.addEventListener('load', () => {
            newArr.push(res);
            if (newArr.length == canvases.length) {
              setCanvases(newArr);
            }
          });
        });
      });
    } else {
      let { angle, index } = imgData;
      let c = canvases[index];
      let imageRotate = new ImageRotation(c, { quality: 1 });
      imageRotate.generate(angle, 'image/png').then(res => {
        let img = new Image();
        img.src = res;
        img.addEventListener('load', () => {
          let newArr = canvases.map((cur, i) => {
            return i == index ? res : cur;
          });
          setCanvases(newArr);
        });
      });
    }
  };

  const moveUp = index => {
    if (index == 0) return;
    let current = canvases[index],
      next = canvases[index - 1];
    let newArr = canvases.map((cur, i) =>
      i == index - 1 ? current : i == index ? next : cur
    );
    setCanvases(newArr);
  };

  const moveDown = index => {
    if (index == canvases.length - 1) return;
    let current = canvases[index],
      next = canvases[index + 1];
    let newArr = canvases.map((cur, i) =>
      i == index + 1 ? current : i == index ? next : cur
    );
    setCanvases(newArr);
  };

  const removeCanvas = index => {
    let newArr = canvases.filter((cur, i) => i != index);
    setCanvases(newArr);
  };

  return (
    <>
      <div className="preprocessor__controls">
        <div className="preprocessor__controls--left">
          <button
            className="controls__btn"
            onClick={() => {
              rotate({ angle: 90 }, true);
            }}
          >
            <RotateRightOutlined className="icon" />
            <span>Rotate All Right</span>
          </button>

          <button
            className="controls__btn"
            onClick={() => {
              rotate({ angle: -90 }, true);
            }}
          >
            <RotateLeftOutlined className="icon" />
            <span>Rotate All Left</span>
          </button>
        </div>
        <div className="preprocessor__controls--right">
          <button
            className="controls__btn controls__download"
            onClick={() => {
              setLoading(true, 'Loading Mulyankan Interface');
              setTimeout(() => {
                setPreprocess([]);
                setFabricCanvases(canvases);
                setTimeout(() => setLoading(false), 1000);
              }, 2000);
            }}
          >
            <span>Proceed To Mulyankan</span>
            <ArrowRightOutlined className="icon" />
          </button>
        </div>
      </div>
      <div className="preprocessor__canvases">
        {canvases.map((cur, i) => {
          return (
            <div className="canvas__wrapper" key={i}>
              <div className="preprocess__canvas__controls">
                <button
                  className="canvas__controls__btn"
                  onClick={() => {
                    moveDown(i);
                  }}
                >
                  <DownOutlined className="icon" />
                </button>
                <button
                  className="canvas__controls__btn"
                  onClick={() => {
                    moveUp(i);
                  }}
                >
                  <UpOutlined className="icon" />
                </button>
                <button
                  className="preprocess__canvas__controls__btn"
                  onClick={() => {
                    rotate({ angle: 90, index: i }, false);
                  }}
                >
                  <RotateRightOutlined className="icon" />
                </button>
                <button
                  className="preprocess__canvas__controls__btn"
                  onClick={() => {
                    removeCanvas(i);
                  }}
                >
                  <DeleteOutlined className="icon" />
                </button>
              </div>
              <canvas
                className={`preprocess__canvas preprocess__canvas--${i}`}
              ></canvas>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Preprocessor;

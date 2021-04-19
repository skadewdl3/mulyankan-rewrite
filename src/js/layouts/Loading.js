import React, { useEffect, useState } from 'react';
import { randomFact } from './../logic/loadingFacts';

const Loading = ({ isOpen, message }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [fact, setFact] = useState('');

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

  const onAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  return (
    <>
      {shouldRender && (
        <>
          <div
            className="loading"
            style={{ animation: `${isOpen ? 'fadeIn' : 'fadeOut'} 0.5s` }}
            onAnimationEnd={onAnimationEnd}
          >
            <div className="generic__wrapper">
              <img
                src="./images/loading.jpg"
                alt="Loading"
                className="loading__image"
              />
              <div className="loading__sub-message">{message}</div>
              <div className="loading__message">
                {fact !== '' && <strong>Factoid:</strong>} {fact}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Loading;

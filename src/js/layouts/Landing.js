import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <>
      <Link to="/editor" className="cta-link" style={{ display: 'none' }} />
      <Link to="/docs" className="docs-link" style={{ display: 'none' }} />
      <Link
        to="/contact"
        className="contact-link"
        style={{ display: 'none' }}
      />

      <div className="landing__wrapper">
        <ul className="landing__nav">
          <li
            className="landing__nav__item"
            onClick={() => document.querySelector('.docs-link').click()}
          >
            Documentation
          </li>
          <li
            onClick={() => document.querySelector('.contact-link').click()}
            className="landing__nav__item"
          >
            Contact Us
          </li>
        </ul>
        <div className="landing__hero">
          <div className="landing__text">
            <div className="landing__title">
              <div className="landing__title--main">Mulyankan</div>
              <div className="landing__title--sub">
                Easiest way to check papers online.
              </div>
            </div>
            <div className="landing__cta-wrapper">
              <button
                className="landing__cta"
                onClick={() => {
                  document.querySelector('.cta-link').click();
                }}
              >
                Check it Out
              </button>
            </div>
          </div>
          <div className="landing__image">
            <img src="./images/hero.jpg" alt="Teachers teaching Students" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;

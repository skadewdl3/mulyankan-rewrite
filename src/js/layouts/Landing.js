import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      title: 'Simple and Elegant',
      description:
        'Mulyankan provides an interface which is easy to pick up even for new users. It takes no more than 5 minutes to become a pro at checking papers using Mulyankan.',
      src: './images/feature-interface.svg',
    },
    {
      title: 'Check, Mark, Comment',
      description:
        "Correcting mistakes and marking is a breeze with Mulyankan. Just add the marks. We'll do the calculations for you.",
      src: './images/feature-check.svg',
    },
    {
      title: 'Fast. Free. Forever.',
      description:
        "Mulyankan is the fastest paper checking app out there. And it's free! All features included, because education should never be restricted by anything.",
      src: './images/feature-fast.svg',
    },
  ];

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
            onClick={() =>
              document
                .querySelector('.landing__features__header')
                .scrollIntoView()
            }
            className="landing__nav__item"
          >
            Features
          </li>
          <li
            onClick={() =>
              document.querySelector('.landing__contact').scrollIntoView()
            }
            className="landing__nav__item"
          >
            Get in Touch
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
              <br />
              <button
                className="landing__secondary-cta"
                onClick={() => {
                  document.querySelector('.docs-link').click();
                }}
              >
                Documentation
              </button>
            </div>
          </div>
          <div className="landing__image">
            <img src="./images/hero.jpg" alt="Teachers teaching Students" />
          </div>
        </div>

        <div className="landing__features">
          <div className="landing__features__header">Features</div>
          <div className="landing__features__messages">
            <div className="landing__features__message">
              We truly understand a <span>teachers needs.</span>
            </div>
            <div className="landing__features__sub-message">
              That's why we made Mulyankan tailored to provide an optimal
              experience to teachers.
            </div>
          </div>

          <div className="landing__features__grid">
            {features.map((feature, index) => (
              <div className="landing__feature" key={`feature=${index}`}>
                <div className="landing__feature__img">
                  <img src={feature.src} alt="" />
                </div>
                <div className="landing__feature__title">{feature.title}</div>
                <div className="landing__feature__description">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="landing__reviews"></div> */}

        <div className="landing__contact">
          <div className="landing__contact__header">Get In Touch</div>
          <div className="landing__contact__grid">
            <div className="landing__contact__text">
              <div className="landing__contact__text--docs">
                Do you need help regarding any feature of Mulyankan ? Check out
                the extensive documentation - <br />
                <br />
                <Link
                  className="landing__contact__text--documentation-link"
                  to="/docs"
                >
                  Documentation
                </Link>
              </div>

              <div className="landing__contact__text--email">
                If it doesn't help, we would be happy to. Be it a query, a
                feature request, a bug report or just your reviews - do drop us
                an email at{' '}
                <a href="mailto:mulyankanweb@gmail.com">
                  mulyankanweb@gmail.com
                </a>{' '}
                and we'll get back to you ASAP.
              </div>
            </div>
            <div className="landing__contact__image">
              <img src="./images/contact.svg" alt="Get In Touch" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;

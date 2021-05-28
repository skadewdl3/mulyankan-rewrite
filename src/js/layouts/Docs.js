import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Redirect } from 'react-router-dom';

import Preloader from './../components/Preloader';

export const docsOptions = [
  { name: 'Introduction', id: 'intro' },
  { name: 'Getting Started', id: 'getting-started' },
  { name: 'Basic Usage', id: 'basic-usage' },
  { name: 'Text and Marks', id: 'text-and-marks' },
  { name: 'Text Editing', id: 'text-editing' },
  { name: 'Copy and Paste', id: 'copy-and-paste' },
  { name: 'Changing Colors', id: 'colors' },
  { name: 'Keyboard Shortcuts', id: 'keyboard-shortcuts' },
];

const Docs = props => {
  let { id: urlId } = props.match.params;

  const [id, setId] = useState(urlId ? urlId : 'intro');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDocsSubLink, setShowDocsSubLink] = useState(false);

  //   const str = `
  //   ## Text and Marks
  // <br>
  // This section will cover adding textboxes to and marking the paper using Mulyankans automatic marking system.
  // <br>
  // <br>

  // \`\`\`
  // Contents:

  // 1. Adding Textboxes
  // 2. Adding Markboxes
  // 3. Understanding Automatic Marking
  // 4. Quickly Inserting Marks
  // \`\`\`

  // <br>
  // <br>

  // All the options about text are present in the _Text Tab_ in the Sidebar. You can access it by clicking on the text tab in the Sidebar.

  // <br>

  // ![Switching to Text Tab](https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/text-and-marks/text-and-marks-1.webp)

  // <br>
  // <br>

  // ### Adding Textboxes
  // Adding textboxes is similar to adding symbols. You can drag the option from the Sidebar onto the editing area to add a textbox. You can _single click_ a textbox to select and and _double click_ a textbox to edit it.
  // <br>
  // <br>

  // ![Adding Textboxes](https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/text-and-marks/text-and-marks-2.webp)

  // <br>
  // Textboxes can be removed in a similar way to symbols. You can _right-click_ and select remove or you can drag them out of the page.

  // <br>
  // <br>

  // ### Adding Markboxes
  // Markboxes are meant specifically for marking. They are added in the same way as textboxes. If you enter a number in the markbox, Mulyankan will automatically add it up to the total of the marks. The total marks are visible in the _Marking Tab_.
  // <br>
  // <br>
  // ![Removing Symbols](https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/basic-usage/basic-usage-2.webp)
  // <br>
  // <br>
  // ### Zooming
  // Sometimes, a PDF has a large/small size page. You can zoom in/out to make the page smaller or bigger. You can click _Zoom In_ button in the Menu Bar to zoom in. You can click the _Zoom Out_ button in the Menu Bar to zoom out.
  // <br>
  // <br>
  // ![Zooming In and Out](https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/basic-usage/basic-usage-3.webp)
  // <br>
  // Clicking the _Reset Zoom_ button sets the size of page to initial size (the one you say when the pdf opened).
  // <br>
  // <br>
  // <br>

  // In the next section, we will cover adding text and using Mulyankans automatic marking system.

  // `;

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/${id}/${id}.md`
      )
      .then(({ data }) => {
        let str = data;
        setContent(str);
        setLoading(false);
      });

    // NOTE: The below code is only for testing and writing documentation. Use the above code in production.
    // let newStr = str;
    // setContent(newStr);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2000);

    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (urlId) setId(urlId);
  }, [urlId]);

  const isInViewport = el => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useEffect(() => {
    let fn = debounce(() => {
      let span = document.querySelector(
        '#root > div.generic__wrapper > div > span:nth-child(2)'
      );
      if (!isInViewport(span)) {
        console.log('scrolled past');
        setShowDocsSubLink(true);
      } else if (isInViewport(span)) {
        console.log('this ran');
        setShowDocsSubLink(false);
      }
    }, 50);
    window.addEventListener('scroll', fn);

    return () => {
      window.removeEventListener('scroll', fn);
    };
  }, []);

  return (
    <>
      {!urlId && <Redirect to="/docs/intro" />}
      <div className="docs-links">
        {docsOptions.map(option => (
          <Link
            to={`/docs/${option.id}`}
            className={`docs-${option.id}-link`}
            key={option.id}
          />
        ))}
      </div>
      <Link to="/" className="docs__back" style={{ display: 'none' }} />
      <div className="generic__wrapper">
        <div
          className="generic__nav"
          onClick={() => document.querySelector('.docs__back').click()}
          onMouseOver={() => {
            document
              .querySelector('.docs__back__icon')
              .classList.add('generic__back__icon--animated');
            setTimeout(
              () =>
                document
                  .querySelector('.docs__back__icon')
                  .classList.remove('generic__back__icon--animated'),
              100
            );
          }}
        >
          <ArrowLeftOutlined
            style={{
              fontSize: '3rem',
              margin: '0 1rem',
              transition: 'all .2s ease-out',
            }}
            className="docs__back__icon"
          />
          <span>Documentation</span>
        </div>
      </div>
      <div className="generic__container docs__container">
        <div className="docs__sidenav">
          <div
            className={`docs__sidenav__back ${
              showDocsSubLink ? 'docs__sidenav__back--visible' : ''
            }`}
            onClick={() => {
              document.querySelector('.docs__back').click();
              window.scrollTo(0, 0);
            }}
            onMouseOver={() => {
              document
                .querySelector('.docs__back__icon--sub')
                .classList.add('generic__back__icon--animated');
              setTimeout(
                () =>
                  document
                    .querySelector('.docs__back__icon--sub')
                    .classList.remove('generic__back__icon--animated'),
                100
              );
            }}
          >
            <ArrowLeftOutlined
              style={{
                fontSize: '3rem',
                margin: '0 1rem',
                transition: 'all .2s ease-out',
              }}
              className="docs__back__icon docs__back__icon--sub"
            />
            <span>Docs</span>
          </div>
          <ul className="docs__sidenav__ul">
            {docsOptions.map((cur, index) => (
              <li
                key={index}
                className={`docs__sidenav__item docs__sidenav__item--${
                  cur.id
                } ${id == cur.id ? 'docs__sidenav__item--active' : ''}`}
                onClick={() => {
                  document.querySelector(`.docs-${cur.id}-link`).click();
                }}
              >
                {cur.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="docs__content">
          {!loading ? (
            <>
              <ReactMarkdown
                remarkPlugins={[gfm]}
                rehypePlugins={[rehypeRaw]}
                children={content}
              ></ReactMarkdown>
              <div className="docs__content__buttons">
                {!(id == docsOptions[0].id) && (
                  <button
                    className="docs__content__button"
                    onClick={() => {
                      if (id == docsOptions[0].id) return;
                      let newId =
                        docsOptions[
                          docsOptions.indexOf(
                            docsOptions.find(doc => doc.id == id)
                          ) - 1
                        ].id;
                      // setId(newId);
                      document.querySelector(`.docs-${newId}-link`).click();
                    }}
                  >
                    <LeftOutlined />
                    <span>
                      {
                        docsOptions[
                          docsOptions.indexOf(
                            docsOptions.find(doc => doc.id == id)
                          ) - 1
                        ].name
                      }
                    </span>
                  </button>
                )}

                {!(id == docsOptions[docsOptions.length - 1].id) && (
                  <button
                    className="docs__content__button"
                    onClick={() => {
                      if (id == docsOptions[docsOptions.length - 1].id) return;
                      let newId =
                        docsOptions[
                          docsOptions.indexOf(
                            docsOptions.find(doc => doc.id == id)
                          ) + 1
                        ].id;
                      document.querySelector(`.docs-${newId}-link`).click();
                    }}
                  >
                    <span>
                      {
                        docsOptions[
                          docsOptions.indexOf(
                            docsOptions.find(doc => doc.id == id)
                          ) + 1
                        ].name
                      }
                    </span>
                    <RightOutlined />
                  </button>
                )}
              </div>
            </>
          ) : (
            <Preloader accent={true} scale={1} />
          )}
        </div>
      </div>
    </>
  );
};

export default Docs;

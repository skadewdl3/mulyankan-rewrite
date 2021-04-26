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

export const docsOptions = [
  { name: 'Introduction', id: 'intro' },
  { name: 'Getting Started', id: 'getting-started' },
  { name: 'Basic Usage', id: 'basic-usage' },
  { name: 'Text and Marks', id: 'text-and-marks' },
  { name: 'Keyboard Shortcuts', id: 'keyboard-shortcuts' },
  // { name: 'Advanced', id: 'advanced' },
];

const Docs = () => {
  const [id, setId] = useState('intro');
  const [content, setContent] = useState('');
  const [showDocsSubLink, setShowDocsSubLink] = useState(false);

  const str = `
## Basic Usage
<br>
This section will cover uploading files to Mulyankan and accessing the Mulyankan interface.
<br>
<br>

\`\`\`
Contents:

1. First Steps...
2. Uploading Files
3. Introduction to the Interface
\`\`\`

<br>
<br>

### First Steps...
When you first go to the Mulyankan Website, you will see the Landing Page would look similar to this.
![Mulyankan Landing Page](https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/getting-started/getting-started-1.png)
<br>
<br>
To upload files and get started, click the **Check it Out** button. <br>
On doing so, you will be presented with a File Upload Screen which would look like this.
![Mulyankan File Upload](https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/getting-started/getting-started-2.png)

<br>
<br>

### Uploading Files

Click on the Select Files button. This will open a file picker where you can pick files. Once you have selected them, they should appear in the grey section like so.

![Mulyankan File Selection](https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/getting-started/getting-started-3.png)


<br>
<br>

You can add more files by the same process. You can also remove files by clicking on the **×** symbol on the file. <br>
Once you're done, click **Proceed**. You will see the loading screen for a brief time and then the Mulyankan Editing Interface will appear as follows.

![Mulyankan Editing Interface](https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/getting-started/getting-started-4.png)

<br>
<br>

### Introduction to The Interface

It may look daunting at first, but the Mulyankan interface is quite simple. Let's break it down. 
<br>
<br>
\`\`\`
It is divided into 3 main parts.

1. The Editing Area
2. The Sidebar
3. The Menu Bar
\`\`\`

![Mulyankan Editing Interface Description](https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/getting-started/getting-started-5.png)

<br>
<br>

1. **The Editing Area**: The editing area is where all the magic happens. This is the area when you drag the symbols (check, cross, underline, etc.) from the sidebar to insert them on the exam paper.
<br>
<br>


2. **The Sidebar**: The Sidebar provides all the utilities you need for checking the exam paper. We'll explore these in detail in subsequent sections. The utilities include various symbols, textbox (for comments), markbox (for marking) and more.
<br>
<br>


3. **The Menu Bar**: The Menu Bar helps you in navigating through Mulyankan easily. The Zoom In and Zoom out options do exactly what they say. They can increase / decrease the size of the exam paper to help you view it more clearly. It also includes the download button which will be covered in detail in a  later section.


<br>
<br>
<br>


Not so scary now right ? <br>
Good. In the next section, we'll start checking the exam paper using symbols in the Sidebar.
`;

  useEffect(() => {
    // let newStr = str;
    axios
      .get(
        `https://raw.githubusercontent.com/skadewdl3/mulyankan-rewrite/docs/${id}/${id}.md`
      )
      .then(({ data }) => {
        let str = data;
        console.log(data);
        // str = str.replaceAll('\n', '  ');
        setContent(str);
      });
    // setContent(newStr);
    window.scrollTo(0, 0);
  }, [id]);

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
  }, []);

  return (
    <>
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
                onClick={() => setId(cur.id)}
              >
                {cur.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="docs__content">
          <ReactMarkdown
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeRaw]}
            children={content}
          ></ReactMarkdown>
          <div className="docs__content__buttons">
            <button
              className="docs__content__button"
              onClick={() => {
                if (id == docsOptions[0].id) return;
                let newId =
                  docsOptions[
                    docsOptions.indexOf(docsOptions.find(doc => doc.id == id)) -
                      1
                  ].id;
                setId(newId);
              }}
            >
              <LeftOutlined />
              <span>Previous</span>
            </button>
            <button
              className="docs__content__button"
              onClick={() => {
                if (id == docsOptions[docsOptions.length - 1].id) return;
                let newId =
                  docsOptions[
                    docsOptions.indexOf(docsOptions.find(doc => doc.id == id)) +
                      1
                  ].id;
                setId(newId);
              }}
            >
              <span>Next</span>
              <RightOutlined />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Docs;

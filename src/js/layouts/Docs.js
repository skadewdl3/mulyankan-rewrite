import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import marked from 'marked';

export const docsOptions = [
  { name: 'Introduction', id: 'intro' },
  { name: 'Basic Usage', id: 'basic-usage' },
  { name: 'Text and Marks', id: 'text-and-marks' },
  { name: 'Keyboard Shortcuts', id: 'keyboard-shortcuts' },
  // { name: 'Advanced', id: 'advanced' },
];

const Docs = () => {
  const [id, setId] = useState('intro');
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/docs/${id}`).then(({ data }) => {
      let { content } = data;
      // marked.setOptions({
      //   renderer: new marked.Renderer(),
      //   gfm: true,
      //   tables: true,
      //   breaks: false,
      //   pedantic: false,
      //   sanitize: true,
      //   smartLists: true,
      //   smartypants: false,
      // });
      setContent(content);
    });
  }, [id]);

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
        <div
          className="docs__content"
          dangerouslySetInnerHTML={{
            __html: marked(content, {
              renderer: new marked.Renderer(),
              gfm: true,
              tables: true,
              breaks: false,
              pedantic: false,
              sanitize: true,
              smartLists: true,
              smartypants: false,
            }),
          }}
        ></div>
      </div>
    </>
  );
};

export default Docs;

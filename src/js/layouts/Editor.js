import React, { Component } from 'react';
import hotkeys from 'hotkeys-js';

// Layouts
import FileUpload from './FileUpload';
import Loading from './Loading';
import Preprocessor from './Preprocessor';
import Downloading from './Downloading';

// Components
import Controls from './../components/Controls';
import Canvas from './../components/Canvas';

// Fire Events on Canvas for Text/Image Changes
import {
  setZoomLevel,
  moveObject,
  updateFont,
  updateText,
  updateColor,
} from './../logic/canvasTransforms';

// Fire Events on Canvas for Copy/Paste/Favourite/Remove etc.
import {
  changeMarks,
  changeActiveCanvas,
  copyObject,
  pasteObject,
  removeObject,
  updateQuickAccess,
  checkMark,
} from './../logic/miscellaneous';

export class Editor extends Component {
  constructor(props) {
    // Load Favourites from Local Storage
    let quickAccess = [];
    if (window.localStorage.getItem('favourites')) {
      let temp = JSON.parse(window.localStorage.getItem('favourites'));
      quickAccess = temp;
    }

    // Load default color from Local Storage
    let color = 'red';
    if (
      window.localStorage.getItem('color') &&
      window.localStorage.getItem('color') != 'undefined'
    ) {
      let temp = window.localStorage.getItem('color');
      color = temp;
    }

    super(props);

    this.state = {
      fcanvases: [],
      files: [],
      preprocess: [],
      json: [],
      uploadMethod: 'pdf',
      fileName: 'Document',
      loading: false,
      loadingMessage: "We're processing your documents.",
      downloading: false,
      marks: 0,
      totalMarks: '',
      quickAccess,
      color,
      defaultTextOptions: {
        font: 'Roboto',
        bold: false,
        italic: false,
        underline: false,
        superscript: false,
        subscript: false,
        align: null,
      },
    };
  }

  // TODO: Implement loading fcanvases from JSON
  setJSON = json => this.setState({ json });

  // Redundant as of now. Will be used when implementing loading from JSON.
  setUploadMethod = uploadMethod => this.setState({ uploadMethod });

  // Used as an initial phase before setPreprocess or setFCanvases
  setFiles = files => this.setState({ files });

  setFCanvases = fcanvases => {
    this.setState({ fcanvases });
  };

  getFCanvases = () => [...this.state.fcanvases];

  setPreprocess = preprocess => this.setState({ preprocess });

  setFileName = fileName => {
    this.setState({ fileName });
  };

  // Showing Loading screen while switching between screens
  setLoading = (loading, loadingMessage) =>
    this.setState({ loading, loadingMessage });

  // Show downloading interface when button is clicked
  setDownloading = downloading => this.setState({ downloading });

  // Add canvas to fcanvases (used in setupCanvas.js)
  addCanvas = canvas => {
    this.setState({ fcanvases: [...this.state.fcanvases, canvas] });
  };

  tempArr = [];
  addJSONCanvas = (canvas, isLast) => {
    this.tempArr.push(canvas);
    if (isLast) {
      console.log(this.tempArr);
      this.setState({ fcanvases: this.tempArr });
      this.tempArr = [];
    }
    console.log(canvas);
  };

  setZoom = (val, reset = false) => setZoomLevel(val, reset, this);

  updateMarks = () => changeMarks(this);

  setMarks = marks => this.setState({ marks });

  getMarks = () => this.state.marks;

  setTotalMarks = text => {
    let totalMarks = checkMark(text);
    this.setState({ totalMarks });
  };

  getTotalMarks = () => this.state.totalMarks;

  setActiveCanvas = index => changeActiveCanvas(index, this);

  copy = index => copyObject(index, this);
  paste = (index, coords) => pasteObject(index, coords, this);
  remove = index => removeObject(index, this);

  moveActiveObject = direction => moveObject(direction, this);

  // Add/Update/Remove objects from quickAccess array
  setQuickAccess = quickAccess => {
    this.setState({ quickAccess });
    window.localStorage.setItem('favourites', JSON.stringify(quickAccess));
  };

  addToQuickAccess = index => updateQuickAccess(index, this);

  favouriteItem = item => {
    this.setQuickAccess([...this.state.quickAccess, item]);
  };
  removeFromFavourites = index =>
    this.setQuickAccess(
      [...this.state.quickAccess].filter((cur, i) => i !== index)
    );

  changeFont = font => updateFont(font, this);

  changeText = data => updateText(data, this);

  // Change defaultTextOptions (which control UI in TextTab.js) according to activeObject on canvas
  updateDefaultTextOptions = toUpdate =>
    this.setState({
      defaultTextOptions: { ...this.state.defaultTextOptions, ...toUpdate },
    });

  // Change color (which control UI in MarkingTab.js and TextTab.js) according to activeObject on canvas
  setColor = color => {
    this.setState({ color: color.name });
    updateColor(color.hex, this);
  };

  cleanup = () => {
    this.setFCanvases([]);
    this.setPreprocess([]);
    this.setFiles([]);
    // this.setFileName('Document');
    this.updateDefaultTextOptions({
      defaultTextOptions: {
        font: 'Roboto',
        bold: false,
        italic: false,
        underline: false,
        superscript: false,
        subscript: false,
        align: null,
      },
    });
  };

  removeObjectMovieListeners = () => {
    window.editorIsFocused = false;
    hotkeys.unbind('up');
    hotkeys.unbind('down');
    hotkeys.unbind('left');
    hotkeys.unbind('right');
  };

  setActiveObject = obj => {
    let fcanvas = [...this.state.fcanvases].filter(cur => cur.activeCanvas)[0];
    if (!obj) {
      fcanvas.discardActiveObject();
      return;
    }
    let index = fcanvas._objects.reduce(
      (prev, cur, i) => (obj == cur ? prev + i : prev),
      0
    );
    fcanvas.setActiveObject(fcanvas.item(index));
  };

  getFiles = () => [...this.state.files];

  render() {
    return (
      <div className="editor__wrapper">
        <Loading
          isOpen={this.state.loading}
          message={this.state.loadingMessage}
        />
        <Downloading
          isOpen={this.state.downloading}
          setIsOpen={this.setDownloading}
          fileName={this.state.fileName}
          setFileName={this.setFileName}
          setZoom={this.setZoom}
          fcanvases={this.state.fcanvases}
          getTotalMarks={this.getTotalMarks}
        />

        {!this.state.fcanvases[0] &&
        !this.state.preprocess[0] &&
        !this.state.files[0] ? (
          <FileUpload
            setFCanvases={this.setFiles}
            setLoading={this.setLoading}
            setPreprocess={this.setPreprocess}
            setFileName={this.setFileName}
            setUploadMethod={this.setUploadMethod}
            setTotalMarks={this.setTotalMarks}
          />
        ) : null}

        {this.state.files[0] && (
          <>
            <Controls
              setLoading={this.setLoading}
              setActiveCanvas={this.setActiveCanvas}
              getFCanvases={this.getFCanvases}
              setFileName={this.setFileName}
              fileName={this.state.fileName}
              setZoom={this.setZoom}
              marks={this.state.marks}
              getTotalMarks={this.getTotalMarks}
              setTotalMarks={this.setTotalMarks}
              setDownloading={this.setDownloading}
              quickAccess={this.state.quickAccess}
              removeFromFavourites={this.removeFromFavourites}
              changeText={this.changeText}
              defaultTextOptions={this.state.defaultTextOptions}
              color={this.state.color}
              setColor={this.setColor}
              cleanup={this.cleanup}
              removeObjectMovieListeners={this.removeObjectMovieListeners}
            />
            <div
              className="editor__container__wrapper"
              onClick={() => (window.editorIsFocused = true)}
            >
              <div className="editor__container">
                {this.state.files.map((cur, index, arr) => (
                  <Canvas
                    src={cur}
                    getJSON={this.getFiles}
                    key={index}
                    setActiveObject={this.setActiveObject}
                    index={index}
                    uploadMethod={this.state.uploadMethod}
                    setFCanvases={this.setFCanvases}
                    addCanvas={this.addCanvas}
                    setZoom={this.setZoom}
                    setActiveCanvas={this.setActiveCanvas}
                    length={arr.length}
                    updateMarks={this.updateMarks}
                    getMarks={this.getMarks}
                    copy={this.copy}
                    paste={this.paste}
                    remove={this.remove}
                    addToQuickAccess={this.addToQuickAccess}
                    moveActiveObject={this.moveActiveObject}
                    favouriteItem={this.favouriteItem}
                    updateDefaultTextOptions={this.updateDefaultTextOptions}
                    getFCanvases={this.getFCanvases}
                    setUploadMethod={this.setUploadMethod}
                    isLast={index === arr.length - 1}
                    addJSONCanvas={this.addJSONCanvas}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {this.state.preprocess[0] && (
          <>
            <Preprocessor
              data={this.state.preprocess}
              setPreprocess={this.setPreprocess}
              setLoading={this.setLoading}
              setFabricCanvases={this.setFiles}
            />
          </>
        )}
      </div>
    );
  }
}

export default Editor;

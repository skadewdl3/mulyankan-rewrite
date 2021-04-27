import React, { Component } from 'react';

// Layouts
import FileUpload from './FileUpload';
import Loading from './Loading';
import Preprocessor from './Preprocessor';
import Downloading from './Downloading';

// Components
import Controls from './../components/Controls';
import Canvas from './../components/Canvas';

// Transforms
import {
  setZoomLevel,
  moveObject,
  updateFont,
  updateColor,
} from './../logic/canvasTransforms';
import {
  changeMarks,
  changeActiveCanvas,
  copyObject,
  pasteObject,
  removeObject,
  updateQuickAccess,
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
      quickAccess,
      color,
      defaultFontOption: 'Roboto',
    };
  }

  setJSON = json => this.setState({ json });

  setUploadMethod = uploadMethod => this.setState({ uploadMethod });

  setFiles = files => this.setState({ files });

  setFCanvases = fcanvases => this.setState({ fcanvases });

  getFCanvases = () => [...this.state.fcanvases];

  setPreprocess = preprocess => this.setState({ preprocess });

  setFileName = fileName => this.setState({ fileName });

  setLoading = (loading, loadingMessage) =>
    this.setState({ loading, loadingMessage });

  setDownloading = downloading => this.setState({ downloading });

  addCanvas = canvas =>
    this.setState({ fcanvases: [...this.state.fcanvases, canvas] });

  setZoom = (val, reset = false) => setZoomLevel(val, reset, this);

  updateMarks = () => changeMarks(this);

  setMarks = marks => this.setState({ marks });

  getMarks = () => this.state.marks;

  setActiveCanvas = index => changeActiveCanvas(index, this);

  copy = index => copyObject(index, this);
  paste = (index, coords) => pasteObject(index, coords, this);
  remove = index => removeObject(index, this);

  moveActiveObject = direction => moveObject(direction, this);

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

  updateDefaultFontOption = defaultFontOption =>
    this.setState({
      defaultFontOption,
    });

  setColor = color => {
    this.setState({ color: color.name });
    updateColor(color.hex, this);
  };

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
        />

        {!this.state.fcanvases[0] &&
        !this.state.preprocess[0] &&
        !this.state.files[0] ? (
          <FileUpload
            setFCanvases={this.setFiles}
            setLoading={this.setLoading}
            setPreprocess={this.setPreprocess}
            setFileName={this.setFileName}
          />
        ) : null}

        {this.state.files[0] && (
          <>
            <Controls
              setLoading={this.setLoading}
              setPreprocess={this.setPreprocess}
              setFCanvases={this.setFCanvases}
              setFiles={this.setFiles}
              setActiveCanvas={this.setActiveCanvas}
              getFCanvases={this.getFCanvases}
              setFileName={this.setFileName}
              fileName={this.state.fileName}
              setZoom={this.setZoom}
              marks={this.state.marks}
              setDownloading={this.setDownloading}
              quickAccess={this.state.quickAccess}
              removeFromFavourites={this.removeFromFavourites}
              changeFont={this.changeFont}
              defaultFontOption={this.state.defaultFontOption}
              color={this.state.color}
              setColor={this.setColor}
            />
            <div className="editor__container__wrapper">
              <div className="editor__container">
                {this.state.files.map((cur, index, arr) => (
                  <Canvas
                    src={cur}
                    key={index}
                    index={index}
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
                    updateDefaultFontOption={this.updateDefaultFontOption}
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

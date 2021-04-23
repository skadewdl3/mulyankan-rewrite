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
import { setZoomLevel, moveObject } from './../logic/canvasTransforms';
import {
  changeMarks,
  changeActiveCanvas,
  copyObject,
  pasteObject,
  removeObject,
} from './../logic/miscellaneous';

export class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fcanvases: [],
      files: [],
      preprocess: [],
      fileName: 'Document',
      loading: false,
      loadingMessage: "We're processing your documents.",
      downloading: false,
      marks: 0,
    };
  }

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
              // setDownloading={setDownloading}
              setFCanvases={this.setFCanvases}
              setFiles={this.setFiles}
              setActiveCanvas={this.setActiveCanvas}
              getFCanvases={this.getFCanvases}
              setFileName={this.setFileName}
              fileName={this.state.fileName}
              setZoom={this.setZoom}
              marks={this.state.marks}
              setDownloading={this.setDownloading}
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
                    moveActiveObject={this.moveActiveObject}
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

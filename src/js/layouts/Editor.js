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
import { setZoomLevel } from './../logic/canvasTransforms';

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

  render() {
    return (
      <div className="editor__wrapper">
        <Loading
          isOpen={this.state.loading}
          message={this.state.loadingMessage}
        />
        <Downloading
          isOpen={this.state.ownloading}
          setIsOpen={this.setDownloading}
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
              getFCanvases={this.getFCanvases}
              setFileName={this.setFileName}
              fileName={this.state.fileName}
              setZoom={this.setZoom}
            />
            <div className="editor__container__wrapper">
              <div className="editor__container">
                {this.state.files.map((cur, index) => (
                  <Canvas
                    src={cur}
                    key={index}
                    index={index}
                    setFCanvases={this.setFCanvases}
                    addCanvas={this.addCanvas}
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

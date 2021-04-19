import React, { Component } from 'react';

import FileUpload from './FileUpload';
import Loading from './Loading';
import Preprocessor from './Preprocessor';

export class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fcanvases: [],
      preprocess: [],
      fileName: 'Document',
      loading: false,
      loadingMessage: "We're processing your documents.",
    };
  }

  setFcanvases = fcanvases => this.setState({ fcanvases });

  getFcanvases = () => [...this.state.fcanvases];

  setPreprocess = preprocess => this.setState({ preprocess });

  setFileName = fileName => this.setState({ fileName });

  setLoading = (loading, loadingMessage) =>
    this.setState({ loading, loadingMessage });

  render() {
    return (
      <div className="editor__wrapper">
        <Loading
          isOpen={this.state.loading}
          message={this.state.loadingMessage}
        />
        {!this.state.fcanvases[0] && !this.state.preprocess[0] ? (
          <FileUpload
            setFcanvases={this.setFcanvases}
            setLoading={this.setLoading}
            setPreprocess={this.setPreprocess}
            setFileName={this.setFileName}
          />
        ) : null}

        {this.state.preprocess[0] && (
          <>
            <Preprocessor
              data={this.state.preprocess}
              setPreprocess={this.setPreprocess}
              setLoading={this.setLoading}
              setFabricCanvases={this.setFCanvases}
            />
          </>
        )}
      </div>
    );
  }
}

export default Editor;

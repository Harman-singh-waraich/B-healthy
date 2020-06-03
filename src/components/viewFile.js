import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import "./viewFile.css"

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

export default class FileView extends Component {
  constructor(props){
    super(props)
    this.state ={
      file: props.file
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  render() {
    const { file, numPages } = this.state;

    return (
      <div className="Example">
          <div className="Example__container__document">
            <Document

              file={file}
              onLoadSuccess={this.onDocumentLoadSuccess}
              options={options}
            >
              {
                Array.from(
                  new Array(numPages),
                  (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                    />
                  ),
                )
              }
            </Document>
          </div>

      </div>
    );
  }
}

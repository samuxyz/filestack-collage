import React, { Component } from 'react';
import filestack from 'filestack-js';
const API_KEY = 'YOUR_API_CALL';

const client = filestack.init(API_KEY);
const processAPI = 'https://process.filestackapi.com';

export default class Container extends Component {

  constructor (props) {
    super(props);
    this.state = { url : '' };
    this.handleUpload = this.handleUpload.bind(this);
  }

  filestack = () => {
    return client.pick(
      {
        accept: 'image/*',
        maxSize: 1024 * 1024 * 5,
        minFiles: 2,
        maxFiles: 6,
      }
    );
  };

  async handleUpload () {
    try {
      const { filesUploaded } = await this.filestack();
      const first = filesUploaded.shift();
      const transformation = filesUploaded.reduce((acc, file, index, files) => {
        return index < files.length - 1
        ? `${acc},${file.handle}`
        : `${acc}],w:800,h:600,/${file.handle}`;
      }, `/collage=files:[${first.handle}`);

      this.setState({ url: processAPI + transformation });
    } catch (e) {
      console.log(e);
    }
  }

  render () {
    const { url } = this.state;
    return (
      <div className="container">
        <div className="page-header">
          <h1>Filestack Collage <small>in action</small></h1>
        </div>
        <div className="row">
          <div className="col-md-8 col-md-offset-2 text-center">
            <div className="thumbnail">
              <img
                className="img-responsive"
                src={url || 'http://placehold.it/800x600?text=Collage'}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="text-center">
            <button className="btn btn-filestack">
              <i className="glyphicon glyphicon-upload" onClick={this.handleUpload} /> Upload
            </button>
          </div>
        </div>
      </div>
    );
  }
}

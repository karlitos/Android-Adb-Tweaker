import React from 'react';

class Packages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filesToInstall: []};
  }

  // handles the drop event
  handleApkDrop(event) {
    const droppedFiles = event.dataTransfer.files;
    // convert the FileList collection to flat array containing only APKs
    let droppedFilesArray = Array.prototype.filter.call(droppedFiles, (file) => {
      return file.type == 'application/vnd.android.package-archive';
    })
    this.setState({
        filesToInstall: droppedFilesArray
    });
    event.preventDefault();
  };
  // prevent default handling of events
  preventDefaultHandling(event) {
    event.preventDefault();
  }

  render(){
    return  (
      <div className="packages">
        <h4>Install and manage packages on selected  device.</h4>
        <div className="drag-n-drop-for-packages"
            onDragOver={::this.preventDefaultHandling}
            onDragEnd={::this.preventDefaultHandling}
            onDrop={::this.handleApkDrop}>
          <p>
            <strong>Drop your APKs here.</strong>
          </p>
        </div>
        <textarea className="form-control files-to-install"
                  placeholder="Slected files to install"
                  rows="3" readOnly
                  value={this.state.filesToInstall.map((file) => {return file.name}).join('\n')}>
        </textarea>
        <button className={`btn ${this.props.adbClientBusy ? 'btn-negative' : 'btn-positive'} pull-right install-packages-padded-buton`}
                onClick={() => this.props.handleFilesInstallSubmit(this.state.filesToInstall)}
                disabled={this.props.adbClientBusy}>
                {this.props.adbClientBusy ? 'Busy' : 'Install'}
        </button>
      </div>
    )
  }
}

export default Packages
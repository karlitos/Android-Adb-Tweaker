//React libraries
import React from 'react';
import ReactDOM from 'react-dom';
// using window.require instead of require is one possibility of avoiding the conflict between electron's and browserify's require function.
const remote = window.require('electron').remote;
const app = remote.app;
// Bluebird JavaScript promises library
const Promise = window.require('bluebird');
// adb kit
const adb = window.require('adbkit');
// few basic operating-system related utility functions
const os = require('os');
// file system
const fs = remote.require('fs');

// Header component
import Header from './components/header.component';

// Footer component
import Footer from './components/footer.component';

// Devices component
import Devices from './components/devices.component';

// Commands component
import Commands from './components/commands.component';

// Packages component
import Packages from './components/packages.component';

class App extends React.Component {
    // Constructor
    constructor(props) {
        super(props);

        // adbkit
        this.adbClient = adb.createClient();

        // Initial State
        this.state = {
            deviceList: [],
            selectedDevice: undefined,
            adbClientBusy: false,
            commandOutput: '',
            installationOutput: ''
        }
    }

    // method handlidng the window closing behavior
    closeApp(){
        const window = remote.getCurrentWindow();
        window.close();
    };
    // handling the selected Android device - updating state
    handleSelectDevice(deviceId) {
        this.setState({
            selectedDevice: deviceId
        });
    };
    // method returning attached devices recognized by ADB
    listAdbDevices(event){
      // when call performed after click on the "list devices" buttons
      if (event) {
        let target = event.currentTarget;
        let animationClassName = 'rotate-element-500ms';
        let originalClassName = target.firstChild.className;
        if (!(originalClassName.indexOf(animationClassName) !== -1)){
          // append new class
          target.firstChild.className += ` ${animationClassName}`;
          // append old className after timeout
          setTimeout(function(){ target.firstChild.className =  originalClassName;}, 500);
         }
      }

        let self = this;
        let detailedDeviceList = [];

      this.adbClient.listDevices()
          .then(function(devices) {
              return Promise.map(devices, function(device) {
                  return self.adbClient.getProperties(device.id)
                      .then(function(property) {
                        // we might keep all properties
                          detailedDeviceList.push({
                              id: device.id,
                              manufacturer: property['ro.product.manufacturer'],
                              name: property['ro.product.display'],
                              model: property['ro.product.model']
                          })
                      })
              })

          })
          .then(function() {
              if (detailedDeviceList.length > 0) {
                  self.setState({deviceList: detailedDeviceList});
              }
          })
          .catch(function(err) {
              console.error('Something went wrong:', err.stack)
              if(err.stack.includes('device unauthorized')) {
                alert('Please check your connected devices and authorize USB-Debugging for this maschine');
              }
          });
    };

    // handles the execution of the selected commands
    executeSelectedCommand(command) {
      // TODO handle device not found - e.g. disconnected
      // TODO handle command empty or wrong type
      // TODO implement adb client busy
      let self = this;
      // reference to the selected device
      let device = this.state.selectedDevice;
      this.adbClient.shell(device, command)
      // Use the readAll() utility to read all the content without
      // having to deal with the events. `output` will be a Buffer
      // containing all the output.
      .then(adb.util.readAll)
      .then(function(output) {
        console.log('[%s] %s', device, output.toString().trim())
        self.setState({
            commandOutput: output.toString().trim()
        });
      })
      .then(function() {
        console.log('Done.')
      })
      .catch(function(err) {
        console.error('Something went wrong:', err.stack)
        self.setState({
            commandOutput: 'Something went wrong when executing adb command: ' + err.stack
        });
      })
      event.preventDefault();
    }

    // handles the installation of the selected APKs
    installSelectedFiles(files) {
      // [checked] TODO implement client busy - promise map ...
      // [checked] TODO handle empty input
      // TODO pass output back to cpomponent

      let self = this;
      // reference to the selected device
      let device = this.state.selectedDevice;
      this.setState({
          adbClientBusy: true
      });
      // Install all files sequentially
      Promise.each(files, function(file, index){
        return self.adbClient.install(device, file.path)
        .then(function() {
          console.log('%s installed on device %s', file.name, device)
        })
        .catch(function(err) {
          console.error('Something went wrong when installing %s on %s: '+  err.stack, file.name, device)
        })
      }).then(function() {
        console.log("All done");
        // client not busy anymore
        self.setState({
          adbClientBusy: false
        });
      })
      .catch(function(err) {
        console.log("Argh, broken: " + err.message);
        // client not busy anymore
        self.setState({
          adbClientBusy: false
        });
      })
    }

    // handles the screenshot capturing on selected device
    takeScreenshot() {
      let self = this;
      // reference to the selected device
      let device = this.state.selectedDevice;

      this.setState({
          adbClientBusy: true
      });
      this.adbClient.screencap(device)
      .then(function(screencap) {

        remote.dialog.showSaveDialog({ title: 'Save the captured screenshot',
                                       defaultPath: app.getPath('home') + '/screenshot.png'
                                     }, function (filePath) {
                                        // dialog aborted
                                        if (!filePath) {
                                          self.setState({
                                              adbClientBusy: false
                                          });
                                          return
                                        };
                                        let out = fs.createWriteStream(filePath);

                                        screencap.on('error', console.log)
                                        .on('data', function(chunk) {
                                          out.write(chunk);
                                        })
                                        .on('end', function() {
                                          // close the file stream
                                          out.end();
                                          self.setState({
                                              adbClientBusy: false
                                          });
                                        });
                                      });
      }) // end of promise.then
      .catch(function(err) {
        console.error('Something went wrong during screenshot capture on %s: '+  err.stack, device);
        self.setState({
            adbClientBusy: false
        });
      })
    }

    // call when component mounted (was created an attached)
    componentDidMount() {
        this.listAdbDevices();
    }

    render () {
        return (
                <div className="app-wrapping-container">
                    {/* Attach header component*/}
                    {/* :: == .bind.this() */}
                    <Header title={this.props.appTitle}
                            takeScreenshot={::this.takeScreenshot}
                            closeApp={::this.closeApp}
                            selectedDevice={this.state.selectedDevice}/>
                    {/* Attach window-content photon element wrapper*/}
                    <div className="window-content window-content-vertical">
                        {/* :: == .bind.this() */}
                        <Devices selectDevice={::this.handleSelectDevice}
                                 listDevices={::this.listAdbDevices}
                                 deviceList={this.state.deviceList}
                                 selectedDevice={this.state.selectedDevice}/>
                       {/* Attach commands component when device selected*/}
                       {this.state.selectedDevice && <Commands handleSelectedCommandSubmit={::this.executeSelectedCommand}
                                                               commandOutput={this.state.commandOutput}/>}
                       {/* Attach commands component when device selected*/}
                       {this.state.selectedDevice && <Packages handleFilesInstallSubmit={::this.installSelectedFiles}
                                                               adbClientBusy={this.state.adbClientBusy}/>}
                    </div>
                    {/* Attach footer component */}
                    <Footer selectedDevice={this.state.selectedDevice}/>
                </div>
        );
    }
}

// Render to index.html
// Rendering components directly into document.body is discouraged
// ReactDOM.render( <App />, document.body);
ReactDOM.render( <App appTitle="Android Adb Tweaker"/>, document.getElementById('main-app-window'));
//React libraries
import React from 'react';
import ReactDOM from 'react-dom';
// using window.require instead of require is one possibility of avoiding the conflict between electron's and browserify's require function.
const remote = window.require('electron').remote;
// Bluebird JavaScript promises library
const Promise = window.require('bluebird');
// adb kit
const adb = window.require('adbkit');

// Header component
import Header from './components/header.component';

// Footer component
import Footer from './components/footer.component';

// Devices component
import Devices from './components/devices.component';

// Commands component
import Commands from './components/commands.component';

//Import Container component
//import AppContainer from './containers/app.container'

class App extends React.Component {
    // Constructor
    constructor(props) {
        super(props);

        // adbkit
        this.adbClient = adb.createClient();

        // Initial State
        this.state = {
            deviceList: [],
            selectedDevice: undefined
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
    listAdbDevices(){
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
      // reference to the selected device
      let device = this.state.selectedDevice;
      this.adbClient.shell(device, command)
      // Use the readAll() utility to read all the content without
      // having to deal with the events. `output` will be a Buffer
      // containing all the output.
      .then(adb.util.readAll)
      .then(function(output) {
        console.log('[%s] %s', device.id, output.toString().trim())
      })
      .then(function() {
        console.log('Done.')
      })
      .catch(function(err) {
        console.error('Something went wrong:', err.stack)
      })
      event.preventDefault();
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
                            closeApp={::this.closeApp}/>
                    {/* Attach window-content photon element wrapper*/}
                    <div className="window-content window-content-vertical">
                        {/* :: == .bind.this() */}
                        <Devices selectDevice={::this.handleSelectDevice}
                                 listDevices={::this.listAdbDevices}
                                 deviceList={this.state.deviceList}
                                 selectedDevice={this.state.selectedDevice}/>
                       {/* Attach commands component when device selected*/}
                       {this.state.selectedDevice && <Commands handleSelectedCommandSubmit={::this.executeSelectedCommand}/>}
                    </div>
                    {/* Attach footer component */}
                    <Footer selectedDevice={this.state.selectedDevice} />
                </div>
        );
    }
}

// Render to index.html
// Rendering components directly into document.body is discouraged
// ReactDOM.render( <App />, document.body);
ReactDOM.render( <App appTitle="App name"/>, document.getElementById('main-app-window'));
//React libraries
import React from 'react';
import ReactDOM from 'react-dom';
// using window.require instead of require is one possibility of avoiding the conflict between electron's and browserify's require function.
const remote = window.require('electron').remote;
// adb kit
const Promise = window.require('bluebird');
const adb = window.require('adbkit');

// Header component
import Header from './components/header.component';

// Footer component
import Footer from './components/footer.component';

// Devices component
import Devices from './components/devices.component';

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

    closeApp(){
        const window = remote.getCurrentWindow();
        window.close();
    };

    handleSelectDevice(deviceId) {
        console.log(deviceId);
        this.setState({
            selectedDevice: deviceId
        });
    };

    listAdbDevices(){
        let self = this;
        let detailedDeviceList = [];

        this.adbClient.listDevices()
            .then(function(devices) {
                return Promise.map(devices, function(device) {
                    return self.adbClient.getProperties(device.id)
                        .then(function(property) {
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
            });
    };

    componentDidMount() {
        this.listAdbDevices();
    }

    render () {
        return (
            <div>
                <div className="window">
                    <Header title={'Title'}
                            closeApp={this.closeApp.bind(this)}/>
                    <div className="window-content">
                        {/* :: == .bind.this() */}
                        <Devices selectDevice={::this.handleSelectDevice}
                                 listDevices={::this.listAdbDevices}
                                 deviceList={this.state.deviceList}
                                 selectedDevice={this.state.selectedDevice}/>
                    </div>
                    <Footer selectedDevice={this.state.selectedDevice} />
                </div>
            </div>
        );
    }
}

// Render to index.html
ReactDOM.render(
<App />,
    document.getElementById('main')
);
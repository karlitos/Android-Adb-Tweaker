import React from 'react';

class DeviceListItem extends React.Component {
    render() {
        return (
          <li className="list-group-item">
            <div className="media-body device-list-element">
                <span className="icon icon-mobile device-list-device-icon pull-left"></span>
                <dl className="inline-flex-description-list">
                    <dt><strong>Manufacturer</strong></dt><dd>{this.props.listItem.manufacturer}</dd>
                    <dt><strong>Name</strong></dt><dd>{this.props.listItem.name}</dd>
                    <dt><strong>Model</strong></dt><dd>{this.props.listItem.model}</dd>
                </dl>
                <div className="radio">
                  <label>
                    <input type="radio"
                           value={this.props.listItem.id}
                           onChange={this.props.onSelectDevice}
                           checked={this.props.checked}/>
                        Select
                  </label>
                </div>
            </div>
            </li>
        );
    }
}

class Devices extends React.Component {

    handleSelectDeviceChange(changeEvent) {
        this.props.selectDevice(changeEvent.target.value);
    };

    buttonIsChecked(deviceId){
        return deviceId == this.props.selectedDevice ? true : false;
    }

    render(){
        let deviceListElements = null;
        if (this.props.deviceList.length < 1) {
            deviceListElements = (<li className="list-group-item no-devices-list-item">
                                  <div className="media-body">No connected devices</div>
                                </li>);
        } else {
          deviceListElements = (<form>
                              {this.props.deviceList.map((item) => {
                                return <DeviceListItem key={item.id}
                                                       listItem={item}
                                                       onSelectDevice={::this.handleSelectDeviceChange}
                                                       checked={::this.buttonIsChecked(item.id)}/>
                                }
                              )}
                      </form>)

        } // end else
        return(

                  <ul className="list-group list-group-not-stretch">
                    <li className="list-group-header list-group-header-with-gradient">
                      <button className="btn btn-large btn-default pull-right"
                              onClick={this.props.listDevices}>
                          <span className="icon icon-text icon-arrows-ccw"></span>
                          List devices
                      </button>
                      <h4>Connected devices</h4>
                    </li>
                    {deviceListElements}
                </ul>

        )
    }
}

/*Devices.defaultProps = {
 deviceList: ['No device detected']
 };*/

export default Devices
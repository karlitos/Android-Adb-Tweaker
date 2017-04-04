import React from 'react';

class DeviceListItem extends React.Component {
    render() {
        return (
            <li className="list-group-item">
            <div className="media-body flex-horizontal">
                <span className="icon icon-mobile pull-left" style={{'fontSize': '250%', 'margin': '0 20px 0 10px'}}></span>
                <dl className="inline-flex">
                    <dt><strong>Manufacturer</strong></dt><dd>{this.props.listItem.manufacturer}</dd>
                    <dt><strong>Name</strong></dt><dd>{this.props.listItem.name}</dd>
                    <dt><strong>Model</strong></dt><dd>{this.props.listItem.model}</dd>
                </dl>
                <div className="radio" style={{'paddingLeft': '5px'}}>
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
        console.log(deviceId, this.props.selectedDevice);
        return deviceId == this.props.selectedDevice ? true : false;
    }

    render(){

        if (this.props.deviceList.length > 0) {
            <h4 style={{'textAlign': 'center', 'margin': '0px'}}>No connected devices</h4>
        } else {

            this.props.deviceList.map(function(name, index){
                return <li className="list-group-item" key={ index }>
                    <strong>{name.manufacturer} - {name.name} - {name.model}</strong>
                    <span className="icon icon-mobile"></span>
                </li>;
            })
        }

        return(
            <div style={{'width': '100%'}}>
                <ul className="list-group" style={{'borderBottom': '1px solid #ddd'}}>
                    <li className="list-group-header"  style={{'background': 'linear-gradient(white 0%, #f6f6f6 50%, #ededed 100%)'}}>
                        <button className="btn btn-large btn-default pull-right"
                                onClick={this.props.listDevices}>
                            <span className="icon icon-text icon-arrows-ccw"></span>
                            List devices
                        </button>
                        <h4 style={{'textAlign': 'center', 'margin': '0px'}}>Connected devices</h4>
                    </li>
                    {this.props.deviceList.length > 0 ? (
                        <form>
                                {this.props.deviceList.map(item => <DeviceListItem key={item.id}
                                                                                   listItem={item}
                                                                                   onSelectDevice={::this.handleSelectDeviceChange}
                                                                                   checked={::this.buttonIsChecked(item.id)}/>
                                )}
                        </form>
                    ) : (
                        // Show only one message when device list empty
                        <li className="list-group-item">
                            <div className="media-body" style={{'textAlign': 'center', 'margin': '10px'}}>No connected devices</div>
                        </li>
                    )}
                </ul>

            </div>
        )
    }
}

/*Devices.defaultProps = {
 deviceList: ['No device detected']
 };*/

export default Devices
import React from 'react';

const commandList = [
  {
    command: 'reboot',
    description: 'REBOOT - Reboot your device'
  },
  {
    command: 'reboot bootloader',
    description: 'REBOOT BOOTLOADER - Reboot your phone into bootloader mode'
  },
  {
    command: 'reboot recovery',
    description: 'REBOOT RECOVERY - Reboot your device into recovery mode'
  },
  {
    command: 'pm list packages',
    description: 'PM LIST PACKAGES - Prints all packages, optionally only those whose package name contains the text in <FILTER>'
  },
  {
    command: 'pm hide',
    description: 'PM HIDE [--user USER_ID] PACKAGE_OR_COMPONENT - Disables app specified by <PACKAGE_OR_COMPONENT> (Android 5.0 and newer)'
  },
  {
    command: 'pm unhide',
    description: 'PM UNHIDE [--user USER_ID] PACKAGE_OR_COMPONENT - Enables app specified by <PACKAGE_OR_COMPONENT> (Android 5.0 and newer)'
  },
  {
    command: 'pm hide com.android.systemui',
    description: 'PM HIDE COM.ANDROID.SYSTEMUI - Disables wallpaper, navigation (buttons) and notification bar (Android 5.0 and newer)'
  },
  {
    command: 'content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:0',
    description: '... accelerometer_rotation --bind value:i:0 - Disable automatic screen rotation'
  },
  {
    command: 'content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:1',
    description: '... user_rotation --bind value:i:1 - Rotate to landscape'
  },
  {
    command: 'content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:0',
    description: '... user_rotation --bind value:i:0 - Rotate to portrait'
  }
]

class Commands extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedCommand: ''};
  }
  // handles the selection of the command
  handleSelectedCommandChange(event) {
      this.setState({selectedCommand: event.target.value});
  }

  render() {
    // method constructing the command selection from the command list
    let commandSelection = (
          <select className="form-control command-selection-dropdown"
                  onChange={::this.handleSelectedCommandChange}
                  defaultValue="placeholder">
            <option value="placeholder" disabled>Click to select command</option>
            {commandList.map((item, index) => {
                return <option key={index} value={item.command}>{item.description}</option>
              })
            }
          </select>
    );

    return (
      <div className="commands">
        <h4>Run command on the selected device.</h4>
        <div className="form-group">
          <label className="command-selection-padded-label">Select adb command from the drop-down list and click on  <i>Execute</i>. To apply some of the commands reboot your device afterwards.</label>
          {commandSelection}
          <span style={{marginLeft: '5px', marginRight: '5px'}}>adb shell</span>
          <input type="command"
                 className="form-control padded-command-input"
                 placeholder="You can also type your own command"
                 value={this.state.selectedCommand}
                 onChange={::this.handleSelectedCommandChange}/>
          <button className="btn btn-default pull-right command-execute-padded-buton"
                  onClick={() => this.props.handleSelectedCommandSubmit(this.state.selectedCommand)}>
                  Execute
            </button>
            <textarea className="form-control executed-command-output"
                      placeholder="Output of the last executed command"
                      rows="3" readOnly
                      value={this.props.commandOutput}></textarea>
        </div>
      </div>
    );
  }
}

export default Commands
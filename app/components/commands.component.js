import React from 'react';

const commandList = [
  {
    command: 'adb reboot',
    description: 'ADB REBOOT - Reboot your device'
  },
  {
    command: 'adb reboot bootloader',
    description: 'ADB REBOOT BOOTLOADER - Reboot your phone into bootloader mode'
  },
  {
    command: 'adb reboot recovery',
    description: 'ADB REBOOT RECOVERY - Reboot your device into recovery mode'
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
                  onClick={::this.handleSelectedCommandChange}
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
        <h4>Run command on the selected device</h4>
        <div className="form-group">
          <label className="command-selection-padded-label">Select adb command from the drop-down list</label>
          {commandSelection}
          <input type="command"
                 className="form-control padded-command-input"
                 placeholder="You can also type your own command"
                 value={this.state.selectedCommand}
                 onChange={::this.handleSelectedCommandChange}/>
          <button className="btn btn-default pull-right command-execute-padded-buton"
                  onClick={() => this.props.handleSelectedCommandSubmit(this.state.selectedCommand)}>
                  Execute
            </button>
        </div>
      </div>
    );
  }
}

export default Commands
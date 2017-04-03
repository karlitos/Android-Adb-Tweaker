import React from 'react';

class Commands extends React.Component {
  render() {
    return (
      <div className="commands">
        <h4>Run command on the selected device</h4>
        <table className="table-striped">
          <thead>
            <tr>
              <th>Command</th>
              <th>Brief explanation</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={this.props.selectCommand}>
              <td>adb reboot</td>
              <td>Reboot your device</td>
            </tr>
            <tr onClick={this.props.selectCommand}>
              <td>adb reboot bootloader</td>
              <td>Reboot your phone into bootloader mode</td>
            </tr>
            <tr onClick={this.props.selectCommand}>
              <td>adb reboot recovery</td>
              <td>Reboot your device into recovery mode</td>
            </tr>
          </tbody>
        </table>
        <h4>Run {this.props.selectedCommand}</h4>
      </div>
    );
  }
}

export default Commands
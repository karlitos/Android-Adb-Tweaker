import React from 'react';

class Header extends React.Component {
    render(){
        console.log();
        return(
        <footer className="toolbar toolbar-footer">
            {this.props.selectedDevice &&
                <h1 className="title">
                    Selected device id: {this.props.selectedDevice}
                </h1>
            }
        </footer>
        )
    }

}

export default Header
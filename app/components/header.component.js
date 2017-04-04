import React from 'react';

class Header extends React.Component {
    render(){
        return(
            <header className="toolbar toolbar-header draggable">
                <h1 className="title">{this.props.title}</h1>
                <div className="toolbar-actions">
                    <button className="btn btn-default pull-right"
                            onClick={this.props.closeApp}>
                        <span className="icon icon-text icon-cancel-circled"></span>
                        Close
                    </button>
                </div>
            </header>
        )
    }

}

export default Header
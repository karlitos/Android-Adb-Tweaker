import React from 'react';

class Header extends React.Component {
    render(){
        return(
            <header className="toolbar toolbar-header draggable">
                <h1 className="title">{this.props.title}</h1>
                <div className="toolbar-actions pull-right">
                    {this.props.selectedDevice && <button className="btn btn-default"
                                                          onClick={this.props.takeScreenshot}>
                        <span className="icon icon-text icon-export"></span>
                          Take screenshot
                    </button>}
                    <button className="btn btn-negative"
                            onClick={this.props.closeApp}>
                      <span className="icon icon-text icon-cancel-circled" style={{color: 'black'}}></span>
                      Close
                    </button>
                </div>
            </header>
        )
    }

}

export default Header
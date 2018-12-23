import React from 'react';
import Extensions from './extensions.jsx';

export default class ExtensionSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: 'js',
      fontColor: '#000',
      click: false
    };
  }

  handleClick = () => {
    this.setState({
      click: true
    });
  };
  handleExtensionsClick = () => {
    this.setState({
      click: false
    });
  };
  handleMouseEnter = () => {
    this.setState({
      fontColor: ' rgb(0, 185, 158)'
    });
  };
  handleMouseLeave = () => {
    this.setState({
      fontColor: '#000'
    });
  };
  selectionChange = selection => {
    this.setState({
      selection: selection
    });
  };
  render() {
    return (
      <React.Fragment>
        <p
          id="extensionSelection"
          style={{
            color: this.state.fontColor
          }}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
        >
          {this.state.selection + ' ▽'}
        </p>
        {(() => {
          if (this.state.click) {
            return (
              <Extensions
                handleextensionsclick={this.handleExtensionsClick}
                selectionchange={this.selectionChange}
                extensionchange={this.props.extensionchange}
              />
            );
          }
        })()}
      </React.Fragment>
    );
  }
}

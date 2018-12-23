import React from 'react';
import { inject, observer } from 'mobx-react';

@inject(({ state }) => ({
  editor: state.editor
}))
@observer
export default class LoadButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontColor: '#000'
    };
  }
  handleChange = e => {
    const file = e.target.files;
    const reader = new FileReader();
    reader.readAsText(file[0]);
    delete this.inputFile;
  };
  handleClick = () => {
    this.inputFile = document.createElement('input');
    this.inputFile.type = 'file';
    this.inputFile.addEventListener('change', this.handleChange);
    const e = document.createEvent('MouseEvents');
    e.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    this.inputFile.dispatchEvent(e);
  };
  handleMouseLeave = () => {
    this.setState({
      fontColor: '#000'
    });
  };
  handleMouseEnter = () => {
    this.setState({
      fontColor: ' rgb(0, 185, 158)'
    });
  };
  render() {
    return (
      <React.Fragment>
        <button
          touch-action="auto"
          style={{
            color: this.state.fontColor
          }}
          onClick={this.handleClick}
          onMouseLeave={this.handleMouseLeave}
          onMouseEnter={this.handleMouseEnter}
        >
          load
        </button>
      </React.Fragment>
    );
  }
}

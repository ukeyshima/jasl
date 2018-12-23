import React from 'react';
import { inject, observer } from 'mobx-react';

@inject(({ state }) => ({
  hotReload: state.hotReload,
  updateHotReload: state.updateHotReload,
  iframeElement: state.iframeElement,
  stopButton: state.stopButton,
  runButton: state.runButton,
  updateRunButtonColor: state.updateRunButtonColor
}))
@observer
export default class HotReloadButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontColor: '#000',
      backgroundColor: '#fff'
    };
  }
  handleClick = () => {
    const bool = this.props.hotReload;
    this.props.updateHotReload(!bool);
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
    if (this.props.iframeElement) {
      this.props.stopButton.dispatchEvent(e);
    } else {
      this.props.runButton.dispatchEvent(e);
      this.props.updateRunButtonColor({
        backgroundColor: ' rgb(0, 185, 158)',
        fontColor: '#eee'
      });
    }
  };
  handleMouseLeave = () => {
    this.setState({
      fontColor: this.props.hotReload ? '#fff' : '#000'
    });
  };
  handleMouseEnter = () => {
    this.setState({
      fontColor: this.props.hotReload ? '#000' : 'rgb(0,185,158)'
    });
  };
  render() {
    return (
      <button
        touch-action="auto"
        style={{
          color: this.state.fontColor,
          backgroundColor: this.props.hotReload ? 'rgb(0,185,158)' : '#fff'
        }}
        onClick={this.handleClick}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
      >
        HotReload
      </button>
    );
  }
}

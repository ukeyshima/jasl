import React from 'react';
import { inject, observer } from 'mobx-react';
import { FaSquare } from 'react-icons/fa';

@inject(({ state }) => ({
  updateStopButton: state.updateStopButton,
  editor: state.editor,
  updateActiveText: state.updateActiveText,
  updateRunAreaRenderingFlag: state.updateRunAreaRenderingFlag,
  updateRunButtonColor: state.updateRunButtonColor,
  updateIframeElement: state.updateIframeElement,
  updateHotReload: state.updateHotReload
}))
@observer
export default class StopButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: '#eee',
      fontColor: ' rgb(0, 185, 158)'
    };
  }
  componentDidMount() {
    this.props.updateStopButton(this.refs.stopButton);
  }
  handleClick = () => {
    this.props.updateActiveText(this.props.editor.getValue());
    this.props.updateRunAreaRenderingFlag(false);
    this.props.updateRunButtonColor({
      backgroundColor: '#eee',
      fontColor: ' rgb(0, 185, 158)'
    });
    this.props.updateIframeElement(null);
    this.props.updateHotReload(false);
  };
  handleMouseEnter = () => {
    this.setState({
      backgroundColor: ' rgb(0, 185, 158)',
      fontColor: '#eee'
    });
  };
  handleMouseLeave = () => {
    this.setState({
      backgroundColor: '#eee',
      fontColor: ' rgb(0, 185, 158)'
    });
  };
  render() {
    return (
      <button
        touch-action="auto"
        ref="stopButton"
        style={{
          backgroundColor: this.state.backgroundColor,
          color: this.state.fontColor
        }}
        onClick={this.handleClick}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
      >
        <FaSquare />
      </button>
    );
  }
}

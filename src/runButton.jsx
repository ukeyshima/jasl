import React from 'react';
import { inject, observer } from 'mobx-react';
import { FaPlay } from 'react-icons/fa';

@inject(({ state }) => ({
  updateRunButton: state.updateRunButton,
  updateActiveText: state.updateActiveText,
  editor: state.editor,
  updateRunAreaRenderingFlag: state.updateRunAreaRenderingFlag,
  updateRunButtonColor: state.updateRunButtonColor,
  iframeElement: state.iframeElement,
  runButtonColorBackgroundColor: state.runButtonColor.backgroundColor,
  runButtonColorFontColor: state.runButtonColor.fontColor
}))
@observer
export default class RunButton extends React.Component {
  componentDidMount() {
    this.props.updateRunButton(this.refs.runButton);
  }
  handleClick = () => {
    const text = this.props.editor.getValue();
    this.props.updateActiveText(text);
    this.props.updateRunAreaRenderingFlag(true);
  };

  handleMouseEnter = () => {
    this.props.updateRunButtonColor({
      backgroundColor: ' rgb(0, 185, 158)',
      fontColor: '#eee'
    });
  };
  handleMouseLeave = () => {
    if (!this.props.iframeElement) {
      this.props.updateRunButtonColor({
        backgroundColor: '#eee',
        fontColor: ' rgb(0, 185, 158)'
      });
    }
  };
  render() {
    return (
      <button
        touch-action="auto"
        ref="runButton"
        style={{
          backgroundColor: this.props.runButtonColorBackgroundColor,
          color: this.props.runButtonColorFontColor
        }}
        onClick={this.handleClick}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
      >
        <FaPlay />
      </button>
    );
  }
}

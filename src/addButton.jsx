import React from 'react';
import CreateTextFileForm from './createTextFileForm.jsx';

export default class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontColor: '#000',
      click: false,
      clickX: 0,
      clickY: 0
    };
  }
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }
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
  handleClick = e => {
    this.setState({
      click: true,
      clickX: e.nativeEvent.x,
      clickY: e.nativeEvent.y
    });
  };
  handleDocumentClick = e => {
    if (
      e.target.id !== 'addButton' &&
      e.target.id !== 'fileName' &&
      e.target.id !== 'extensionSelection' &&
      e.target.id !== 'extensions' &&
      e.target.className !== 'extension'
    ) {
      this.setState({
        click: false
      });
    }
  };
  render() {
    return (
      <React.Fragment>
        <button
          touch-action="auto"
          id="addButton"
          style={{
            color: this.state.fontColor
          }}
          onMouseLeave={this.handleMouseLeave}
          onMouseEnter={this.handleMouseEnter}
          onClick={this.handleClick}
        >
          +
        </button>
        {(() => {
          if (this.state.click) {
            return <CreateTextFileForm x={this.state.clickX} y={0} />;
          }
        })()}
      </React.Fragment>
    );
  }
}

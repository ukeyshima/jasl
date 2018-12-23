import React from 'react';
import { inject, observer } from 'mobx-react';
import ExtensionSelection from './extensionSelection.jsx';

@inject(({ state }) => ({
  textFile: state.textFile,
  editor: state.editor,
  updateActiveUndoStack: state.updateActiveUndoStack,
  updateActiveRedoStack: state.updateActiveRedoStack,
  updateActiveText: state.updateActiveText,
  incrementId: state.incrementId,
  id: state.id,
  pushTextFile: state.pushTextFile
}))
@observer
export default class CreateTextFileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 'main',
      extensionName: 'js',
      createButtonFontColor: '#000'
    };
  }
  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };
  handleExtensionChange = extension => {
    this.setState({
      extensionName: extension
    });
  };
  handleClick = async () => {
    if (
      !this.props.textFile.some(e => {
        return (
          e.fileName === this.state.inputValue + '.' + this.state.extensionName
        );
      })
    ) {
      this.props.incrementId();
      const id = this.props.id;
      const type = (() => {
        let result;
        switch (this.state.extensionName) {
          case 'js':
            result = 'javascript';
            break;
          case 'css':
            result = 'css';
            break;
          case 'glsl':
            result = 'glsl';
            break;
        }
        return result;
      })();

      const undoManager = this.props.editor.session.$undoManager;
      const undoStack = undoManager.$undoStack.slice();
      const redoStack = undoManager.$redoStack.slice();
      await this.props.updateActiveUndoStack(undoStack);
      await this.props.updateActiveRedoStack(redoStack);

      this.props.pushTextFile({
        id: id,
        type: type,
        fileName: this.state.inputValue + '.' + this.state.extensionName,
        removed: false,
        text: '',
        undoStack: [],
        redoStack: [],
        handWritingFormulaAreaId: 0,
        handWritingFormulaAreas: []
      });
    }
  };
  handleMouseEnter = () => {
    this.setState({
      createButtonFontColor: ' rgb(0, 185, 158)'
    });
  };
  handleMouseLeave = () => {
    this.setState({
      createButtonFontColor: '#000'
    });
  };
  render() {
    return (
      <div
        touch-action="auto"
        className="dropDown"
        id="createTextForm"
        style={{
          top: this.props.y,
          left: this.props.x
        }}
      >
        <input
          type="text"
          id="fileName"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
        <ExtensionSelection extensionchange={this.handleExtensionChange} />
        <button
          id="createButton"
          style={{
            color: this.state.createButtonFontColor
          }}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
        >
          create
        </button>
      </div>
    );
  }
}

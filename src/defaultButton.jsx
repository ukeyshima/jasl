import React from 'react';
import { inject, observer } from 'mobx-react';
import css from './default/style.txt'; 
import html from './default/index.txt';
import js from './default/main.txt';
import vs from './default/vertexShader.txt';
import fs from './default/fragmentShader.txt';

@inject(({ state }) => ({
  textFile: state.textFile,
  editor: state.editor,
  updateActiveUndoStack: state.updateActiveUndoStack,
  updateActiveRedoStack: state.updateActiveRedoStack,
  updateActiveText: state.updateActiveText,
  updateEditorValue: state.updateEditorValue,
  hotReload: state.hotReload,
  updateHotReload: state.updateHotReload,
  clearTextFile: state.clearTextFile,
  incrementId: state.incrementId,
  executeHTML: state.executeHTML,
  pushTextFile: state.pushTextFile
}))
@observer
export default class NormalButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontColor: '#000'
    };
  }
  undoStackReset = () => {
    const undoManager = this.props.editor.session.$undoManager;
    const undoStack = undoManager.$undoStack.concat();
    const redoStack = undoManager.$redoStack.concat();
    this.props.updateActiveUndoStack(undoStack);
    this.props.updateActiveRedoStack(redoStack);
    const text = this.props.editor.getValue();
    this.props.updateActiveText(text);
    this.props.editor.setValue('');
    this.props.updateEditorValue('');
  };
  handleClick = async () => {
    const hotReloadFlag = this.props.hotReload;
    this.props.updateHotReload(false);
    await this.props.clearTextFile();
    this.undoStackReset();
    this.props.pushTextFile({
      id: 0,
      type: 'html',
      fileName: 'index.html',
      removed: false,
      text: html,
      undoStack: null,
      redoStack: null
    });
    this.undoStackReset();
    this.props.pushTextFile({
      id: 1,
      type: 'css',
      fileName: 'main.css',
      removed: false,
      text: css,
      undoStack: null,
      redoStack: null
    });
    this.undoStackReset();
    this.props.pushTextFile({
      id: 2,
      type: 'javascript',
      fileName: 'main.js',
      removed: false,
      text: js,
      undoStack: null,
      redoStack: null
    });
    this.undoStackReset();
    this.props.pushTextFile({
      id: 3,
      type: 'glsl',
      fileName: 'vertexShader.glsl',
      removed: false,
      text: vs,
      undoStack: null,
      redoStack: null
    });
    this.undoStackReset();
    this.props.pushTextFile({
      id: 4,
      type: 'glsl',
      fileName: 'fragmentShader.glsl',
      removed: false,
      text: fs,
      undoStack: null,
      redoStack: null
    });
    this.props.incrementId();
    if (hotReloadFlag) {
      this.props.updateHotReload(hotReloadFlag);
      const textFIle = this.props.textFile;
      this.props.executeHTML(textFIle);
    }
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
      <button
        style={{
          color: this.state.fontColor
        }}
        onClick={this.handleClick}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
      >
        default
      </button>
    );
  }
}

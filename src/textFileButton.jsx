import React from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

@inject(({ state }) => ({
  hotReload: state.hotReload,
  updateHotReload: state.updateHotReload,
  editor: state.editor,
  updateActiveUndoStack: state.updateActiveUndoStack,
  updateActiveRedoStack: state.updateActiveRedoStack,
  updateActiveText: state.updateActiveText,
  textFile: state.textFile,
  changeActiveTextFile: state.changeActiveTextFile,
  executeHTML: state.executeHTML,
  activeTextFileFileName: state.activeTextFile.fileName,
  activeTextFile: state.activeTextFile,
  removeTextFile: state.removeTextFile,
  activeTextFileUndoStack: state.activeTextFile.undoStack,
  activeTextFileRedoStack: state.activeTextFile.redoStack,
  activeTextFileId: state.activeTextFileId
}))
@observer
export default class TextFileButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseEnter: false,
      deleteMouseEnter: false
    };
  }
  handleMouseEnter = () => {
    this.setState({
      mouseEnter: true,
      deleteMouseEnter: false
    });
  };
  handleMouseLeave = () => {
    this.setState({
      mouseEnter: false,
      deleteMouseEnter: false
    });
  };
  handleDeleteMouseEnter = () => {
    this.setState({
      deleteMouseEnter: true
    });
  };
  handleDeleteMouseLeave = () => {
    this.setState({
      deleteMouseEnter: false
    });
  };
  handleClick = async (fileName, e) => {
    if (
      e.target.id !== 'delete' &&
      fileName !== this.props.activeTextFileFileName
    ) {
      const hotReloadFlag = this.props.hotReload;
      this.props.updateHotReload(false);
      const undoManager = this.props.editor.session.$undoManager;
      const undoStack = undoManager.$undoStack.slice();
      const redoStack = undoManager.$redoStack.slice();
      await this.props.updateActiveUndoStack(undoStack);
      await this.props.updateActiveRedoStack(redoStack);
      const textFile = this.props.textFile;
      const activeFileIndex = textFile.findIndex(e => {
        return e.fileName === fileName;
      });
      await this.props.changeActiveTextFile(activeFileIndex);
      setTimeout(() => {
        undoManager.reset();
        const activeUndoStack = this.props.activeTextFileUndoStack;
        const activeRedoStack = this.props.activeTextFileRedoStack;
        undoManager.$undoStack = activeUndoStack;
        undoManager.$redoStack = activeRedoStack;
        if (hotReloadFlag) {
          this.props.updateHotReload(hotReloadFlag);
          const textFIle = this.props.textFile;
          this.props.executeHTML(textFIle);
        }
      }, 10);
    }
  };
  handleDeleteClick = async fileName => {
    const hotReloadFlag = this.props.hotReload;
    this.props.updateHotReload(false);
    const textFile = this.props.textFile;
    const activeFileIndex =
      this.props.activeTextFileFileName === fileName
        ? 0
        : this.props.activeTextFileId;
    await this.props.changeActiveTextFile(activeFileIndex);
    const targetFile = textFile.find((e, i) => {
      return e.fileName === fileName;
    });
    await this.props.removeTextFile(targetFile);
    setTimeout(() => {
      const undoManager = this.props.editor.session.$undoManager;
      undoManager.reset();
      const activeUndoStack = toJS(this.props.activeTextFileUndoStack);
      const activeRedoStack = toJS(this.props.activeTextFileRedoStack);
      undoManager.$undoStack = activeUndoStack;
      undoManager.$redoStack = activeRedoStack;
      if (hotReloadFlag) {
        this.props.updateHotReload(hotReloadFlag);
        const textFIle = this.props.textFile;
        this.props.executeHTML(textFIle);
      }
    }, 10);
  };

  render() {
    return (
      <button
        touch-action="auto"
        style={(() => {
          const active =
            this.props.activeTextFileFileName === this.props.fileName;
          const mouseEnter = this.state.mouseEnter;
          return {
            color: active
              ? mouseEnter
                ? '#000'
                : '#fff'
              : mouseEnter
              ? ' rgb(0, 185, 158)'
              : '#000',
            backgroundColor: active ? ' rgb(0, 185, 158)' : '#ccc'
          };
        })()}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onClick={e => this.handleClick(this.props.fileName, e)}
      >
        {(() => {
          if (this.props.fileName !== 'index.html') {
            return (
              <p
                id="delete"
                onMouseEnter={this.handleDeleteMouseEnter}
                onMouseLeave={this.handleDeleteMouseLeave}
                style={(() => {
                  const active =
                    this.props.activeTextFileFileName === this.props.fileName;
                  const mouseEnter = this.state.mouseEnter;
                  const deleteMouseEnter = this.state.deleteMouseEnter;
                  return {
                    color: active
                      ? mouseEnter
                        ? deleteMouseEnter
                          ? '#fff'
                          : '#000'
                        : deleteMouseEnter
                        ? '#000'
                        : '#fff'
                      : mouseEnter
                      ? deleteMouseEnter
                        ? '#000'
                        : ' rgb(0, 185, 158)'
                      : deleteMouseEnter
                      ? ' rgb(0, 185, 158)'
                      : '#000',
                    margin: '0 10px 0 0',
                    float: 'left'
                  };
                })()}
                onClick={() => this.handleDeleteClick(this.props.fileName)}
              >
                ×
              </p>
            );
          }
        })()}
        <p
          style={{
            margin: 0,
            float: 'left'
          }}
        >
          {this.props.fileName}
        </p>
      </button>
    );
  }
}

import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/glsl';
import 'brace/mode/css';
import 'brace/theme/dawn';
import { inject, observer } from 'mobx-react';
import 'brace/ext/language_tools';
import 'brace/snippets/html.js';
import 'brace/snippets/javascript.js';
import 'brace/snippets/glsl.js';
import 'brace/snippets/css.js'; 
import css from './default/style.txt';
import html from './default/index.txt';
import js from './default/main.txt';
import vs from './default/vertexShader.txt';
import fs from './default/fragmentShader.txt';

@inject(({ state }) => ({
  pushTextFile: state.pushTextFile,
  clearTextFile: state.clearTextFile,
  incrementId: state.incrementId,
  updateEditor: state.updateEditor,
  updateHotReload: state.updateHotReload,
  hotReload: state.hotReload,
  updateActiveText: state.updateActiveText,
  executeHTML: state.executeHTML,
  textFile: state.textFile,
  editorValue: state.activeTextFile.text,
  updateEditorValue: state.updateEditorValue,
  activeTextFileType: state.activeTextFile.type,
  activeTextFileId: state.activeTextFileId,
  updateActiveUndoStack: state.updateActiveUndoStack,
  updateActiveRedoStack: state.updateActiveRedoStack,
  saveEvent: state.saveEvent
}))
@observer
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight - 110
    };
  }
  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - 110
    });
    this.editor.resize();
  };
  componentDidMount = () => {
    const editor = this.refs.aceEditor.editor;
    this.editor = editor;
    editor.resize();
    this.props.updateEditor(editor);
    const AceUndoManager = editor.session.$undoManager;
    AceUndoManager.reset();
    this.keyboardHandler = editor.getKeyboardHandler();
    this.keyboardHandler.addCommand({
      name: 'save-event',
      bindKey: { win: 'Ctrl+s', mac: 'Command+s' },
      exec: () => {
        try {
          console.log('saveEvent');
          this.props.saveEvent();
        } catch (e) {
          console.log(e);
        }
      },
      readOnly: true
    });
    window.addEventListener('resize', this.handleResize);

  const hotReloadFlag = this.props.hotReload;
  this.props.updateHotReload(false);
 this.props.clearTextFile();
  this.undoStackReset();
  setTimeout(()=>{
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
  },10)
  
  };
  undoStackReset = () => {
    const undoManager = this.editor.session.$undoManager;
    const undoStack = undoManager.$undoStack.concat();
    const redoStack = undoManager.$redoStack.concat();
    this.props.updateActiveUndoStack(undoStack);
    this.props.updateActiveRedoStack(redoStack);
    const text = this.editor.getValue();
    this.props.updateActiveText(text);
    this.editor.setValue('');
    this.props.updateEditorValue('');
  };
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleChange = e => {
    this.props.updateActiveText(e);
    if (this.props.hotReload) {
      this.props.updateActiveText(e);
      this.props.executeHTML(this.props.textFile);
    }
  };
  render() {
    return (
      <AceEditor
        style={{
          position: 'absolute',
          top: 110,
          width: this.state.width,
          height: this.state.height
        }}
        ref="aceEditor"
        mode={this.props.activeTextFileType}
        theme="dawn"
        onChange={this.handleChange}
        onScroll={this.handleScroll}
        value={this.props.editorValue}
        fontSize={27}
        editorProps={{
          $blockScrolling: Infinity
        }}
        wrapEnabled={false}
        tabSize={4}
        setOptions={{
          hScrollBarAlwaysVisible: true,
          vScrollBarAlwaysVisible: true,
          animatedScroll: true,
          scrollSpeed: 0.7,
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        }}
      />
    );
  }
}

import { observable, computed, action } from 'mobx';
import { toJS } from 'mobx';

class State {
  @observable
  tabChangeEvent = false;
  @action.bound
  updateTabChangeEvent(bool) {
    this.tabChangeEvent = bool;
  }
  @observable
  editorValue = '';
  @action.bound
  updateEditorValue(text) {
    this.editorValue = text;
  }
  @observable
  saveEvent = null;
  @action.bound
  updateSaveEvent(func) {
    this.saveEvent = func;
  }
  @observable
  executeHTML = null;
  @action.bound
  updateExecuteHTML(func) {
    this.executeHTML = func;
  }
  @observable
  runButton = null;
  @action.bound
  updateRunButton(element) {
    this.runButton = element;
  }
  @observable
  stopButton = null;
  @action.bound
  updateStopButton(element) {
    this.stopButton = element;
  }
  @observable
  hotReload = false;
  @action.bound
  updateHotReload(bool) {
    this.hotReload = bool;
  }
  @observable
  editor = null;
  @action.bound
  updateEditor(editor) {
    this.editor = editor;
  }
  @observable
  iframeElement = null;
  @action.bound
  async updateIframeElement(element) {
    this.iframeElement = await element;
  }
  @observable
  textFile = [
    {
      id: 0,
      type: 'html',
      fileName: 'index.html',
      removed: false,
      text: '',
      undoStack: null,
      redoStack: null
    }
  ];
  @action.bound
  pushTextFile(file) {
    if (
      !this.textFile.some(e => {
        return e.fileName === file.fileName;
      })
    ) {
      this.textFile.push(file);
      this.changeActiveTextFile(this.textFile.length - 1);
      setTimeout(() => {
        this.editor.session.$undoManager.reset();
      }, 10);
    }
  }
  @action.bound
  async removeTextFile(file) {
    const nextTextFile = this.textFile.filter(e => e !== file);
    this.textFile = await nextTextFile;
  }
  @action.bound
  clearTextFile() {
    this.textFile = [];
  }
  @observable
  activeTextFile = this.textFile[0];
  @action.bound
  async changeActiveTextFile(index) {
    this.activeTextFile = await this.textFile[index];
  }
  @computed
  get activeTextFileId() {
    return this.textFile.findIndex(e => {
      return e.fileName === this.activeTextFile.fileName;
    });
  }
  @action.bound
  updateActiveText(text) {
    this.activeTextFile.text = text;
  }
  @action.bound
  async updateActiveUndoStack(undoStack) {
    this.activeTextFile.undoStack = await undoStack;
  }
  @action.bound
  async updateActiveRedoStack(redoStack) {
    this.activeTextFile.redoStack = await redoStack;
  }
  @observable
  id = 0;
  @action.bound
  incrementId() {
    this.id++;
  }
  @observable
  runAreaRenderingFlag = false;
  @action.bound
  updateRunAreaRenderingFlag(bool) {
    this.runAreaRenderingFlag = bool;
  }
  @observable
  runAreaPosition = { x: window.innerWidth - 600, y: 100 };
  @action.bound
  updateRunAreaPosition(x, y) {
    this.runAreaPosition.x = x;
    this.runAreaPosition.y = y;
  }
  @observable
  runButtonColor = {
    backgroundColor: '#eee',
    fontColor: ' rgb(0, 185, 158)'
  };
  @action.bound
  updateRunButtonColor(obj) {
    this.runButtonColor = obj;
  }
  @observable
  gl=null;
  @action.bound
  updateGlContext(gl){
    this.gl=gl;
  }
}

export default State;

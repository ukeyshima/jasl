import React from 'react';
import Editor from './editor.jsx';
import RunArea from './runArea.jsx';
import { inject, observer } from 'mobx-react';

@inject(({ state }) => ({
  runAreaRenderingFlag: state.runAreaRenderingFlag,
  runAreaPosition: state.runAreaPosition,
  textFile: state.textFile
}))
@observer
export default class RenderingObject extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Editor />
        {this.props.runAreaRenderingFlag && (
          <RunArea
            style={{
              position: 'absolute',
              left: this.props.runAreaPosition.x,
              top: this.props.runAreaPosition.y,
              width: 400,
              height: 400,
              borderRadius: 5,
              boxShadow: '2px 2px 10px grey',
              zIndex: 26
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

import React from 'react';
import SaveButton from './saveButton.jsx';
import LoadButton from './loadButton.jsx';
import { inject, observer } from 'mobx-react';

@inject('state')
@observer
export default class FileSelect extends React.Component {
  render() {
    return (
      <div
        className="dropDown"
        id="modeSelect"
        style={{
          position: 'absolute',
          left: this.props.style.x,
          top: this.props.style.y
        }}
      >
        <SaveButton />
        <LoadButton />
      </div>
    );
  }
}

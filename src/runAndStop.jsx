import React from 'react';
import RunButton from './runButton.jsx';
import StopButton from './stopButton.jsx';

export default class RunAndStop extends React.Component {
  render() {
    return (
      <div id="runAndStop">
        <RunButton />
        <StopButton />
      </div>
    );
  }
}

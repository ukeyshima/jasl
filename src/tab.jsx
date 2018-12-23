import React from 'react';
import AddButton from './addButton.jsx';
import { inject, observer } from 'mobx-react';
import TextFileButton from './textFileButton.jsx';

@inject(({ state }) => ({
  textFile: state.textFile
}))
@observer
export default class Tab extends React.Component {
  render() {
    return (
      <div id="tab">
        <AddButton />
        {this.props.textFile.map((e, i, a) => {
          return <TextFileButton key={i} fileName={e.fileName} />;
        })}
      </div>
    );
  }
}

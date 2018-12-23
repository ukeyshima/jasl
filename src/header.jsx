import React from 'react';
import File from './file.jsx';
import Mode from './mode.jsx';

export default class Header extends React.Component {
  render() {
    return (
      <div id="header">
        <File />
        {//<Mode />
        }
      </div>
    );
  }
}

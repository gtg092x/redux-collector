import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import Examples from './containers/SimpleContainer';

class Loader extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {

  }
  render() {

    return <Examples />;
  }
}

ReactDOM.render((
    <Loader />
), document.getElementById('root'));

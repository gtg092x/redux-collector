import React from 'react';
import { connect, Provider } from 'react-redux'
import store from '../stores/simple';
import {add, remove, update, removeAll, sort} from '../actions';

function SimpleContainer({onAdd, onUpdate, onSort, onRemoveAll, onRemove, simple = 15}) {



  return (
    <div>
      <h1>Simple</h1>
      <button onClick={onAdd}>Add</button>
      <button onClick={onRemove}>Remove</button>
      <button onClick={onRemoveAll}>Remove All</button>
      <button onClick={onUpdate}>Update</button>
      <button onClick={onSort}>Sort</button>
      <pre>
        {JSON.stringify({simple}, undefined, 4)}
      </pre>
    </div>
  );
}

function mapStateToProps(props) {
  return props;
}

function mapDispatchToProps(dispatch, props) {
  return {
    ...props,
    onAdd: add.bind(undefined, dispatch),
    onUpdate: update.bind(undefined, dispatch),
    onRemove: remove.bind(undefined, dispatch),
    onRemoveAll: removeAll.bind(undefined, dispatch),
    onSort: sort.bind(undefined, dispatch)
  };
}

const SimpleContainerConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleContainer);

export default function (props) {
  return <Provider store={store}><SimpleContainerConnected {...props} /></Provider>
}

# Redux Collector [![Build Status](https://travis-ci.org/gtg092x/redux-collector.svg?branch=master)](https://travis-ci.org/gtg092x/redux-collector)

Easy Collection Reducers for [Redux][].

[![NPM](https://nodei.co/npm/redux-collector.png?downloads=true&stars=true)](https://nodei.co/npm/redux-collector/)

<http://redux-collector.mediadrake.com/>

## Installation

    % npm install redux-collector

## Usage

Redux Collector is a Reducer Generator for Collections

#### MyStore.js

```js
import { createStore } from 'redux';
import collectify from 'redux-collector';

function counterReducer(state = 0, action) {
    switch(action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECRAMENT':
            return state - 1;
        default:
            return state;
    }
}

export default createStore(
  collectify(
    counterReducer, 
    {
      add: 'ADD_ITEM',
      hydrate: 'HYDRATE_ITEMS',
      remove: 'REMOVE_ITEM'
    }
  )
);
```

Then call actions using the types you created with collectify.

#### MyActions.js

```js
import store from './MyStore'

const {dispatch, subscribe, getState} = store;

subscribe(val => console.log('State is:', getState()));

dispatch({
    type: 'HYDRATE_ITEMS',
    data: [1, 2, 3, 4]
});

// State is : [1, 2, 3, 4]

dispatch({
    type: 'ADD_ITEM',
    data: 5
});

// State is : [1, 2, 3, 4, 5]

dispatch({
    type: 'INCREMENT'
});
// State is : [2, 3, 4, 5, 6]

dispatch({
    type: 'DECREMENT',
    query: item => item >= 5
});
// State is : [1, 2, 3, 3, 4]

dispatch({
    type: 'REMOVE',
    query: item => item < 3
});
// State is : [3, 3, 4]

dispatch({
    type: 'REMOVE',
    limit: 2,
    order: -1
});
// State is : [3]
```

## With Reducify

The above reducers can actually be a whole lot shorter.

```js
import { createStore } from 'redux';
import collectify from 'redux-collector';

export default createStore(
  collectify(
    {
      defaultsTo: 0,
      "INCREMENT": state => state + 1,
      "DECRAMENT": state => state - 1
    },
    {
      add: 'ADD_ITEM',
      hydrate: 'HYDRATE_ITEMS',
      remove: 'REMOVE_ITEM'
    }
  )
);
```

This is courtesy of [Reducify][]. Head over to their documentation and check out all the ways you can make reducers. Any argument you pass to collectify get automatically passed to reducify.

## Features

### Operations

#### Order

#### After

#### Sort

#### Limit

### Moving and Sorting

### Indexes

## Customization

### Matcher

## Api

### Hydrate

### Add

### Add Range

### Remove

### Sort

### Move

### Swap

### Reducers

## Gotchas

## With Pipeline

## Without Pipeline

## Credits

Redux Collector is free software under the MIT license. It was created in sunny Santa Monica by [Matthew Drake][].

[Redux]: https://github.com/reactjs/redux
[Matthew Drake]: http://www.mediadrake.com
[Reducify]: http://reducify.mediadrake.com
[Redux Pipeline]: http://redux-pipeline.mediadrake.com

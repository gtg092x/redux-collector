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

This is courtesy of [Reducify][]. Head over to their documentation and check out all the ways you can make reducers. Any argument you pass to collectify gets automatically passed to reducify.

## Features

Basically, you'll get a reducer that does everything you need to arrays. When you call `collectify` you'll get a chance to declare action types for any of the following methods.

### Collectify

```js
collectify([[itemReducer<Object|Function>], actionTypes<Object>]);
```

One primary function, wrap your item reducers with this.

`itemReducer`

Use reducer that you want applied to items in an array as the first (optional) argument.

`actionTypes`

Use this to declare the action types you want to use to manipulate your array. This is a sample configuration:

```js
function itemReducer(state, action) {
    // reducer stuff
}

const actionTypes = {
  add = 'ADD_MY_ITEM',
  move = 'MOVE_MY_ITEM',
  swap = 'SWAP_MY_ITEMS',
  addRange = 'ADD_MY_ITEMS',
  remove = 'REMOVE_MY_ITEMS',
  hydrate = 'HYDRATE_MY_ITEMS',
  sort = 'SORT_MY_ITEMS'
};

const myReducer = collectify(itemReducer, actionTypes);
```

If you pass only one argument, we assume the reducer is a static reducer for an empty array and will treat the one argument as the `actionTypes` argument. See [Reducify static reducers](http://reducify.mediadrake.com/#statics).


### Reducers

If your Collectify reducer does not receive an action type outlined in your config, any actions you dispatch will be passed to your item reducer for every item in your array.

For example:

```js
function itemReducer(state, action) {
    switch(action.type) {
        case "INCREMENT_BY_TWO":
            return state + 2;
        default:
            return state;
    }
}


const myStore = createStore(collectify(itemReducer, {hydrate: 'SET_ITEMS'}));

myStore.dispatch({
    type: 'SET_ITEMS',
    data: [2, 4, 6]
});

// state is [2, 4, 6]

myStore.dispatch({
    type: 'INCREMENT_BY_TWO'
});

// state is [4, 6, 8]
```

Notice the action 'INCREMENT_BY_TWO' was applied to every item in the array.

### Config

There are two configuration options you can pass in with your action types.

#### collectionDefault

This is the default or initial value of the collection.

```js
function itemReducer(state, action) {
  // reducer stuff
}

const myStore = createStore(collectify(itemReducer, {collectionDefault: [1, 2]}));

myStore.dispatch({
    type: 'PASS'
});

// state is [1, 2]
```

#### itemDefault

The default value for any item added with `add` or `addRange`

```js
function itemReducer(state, action) {
  // reducer stuff
}

const myStore = createStore(collectify(itemReducer, {itemDefault: 10, add: 'ADD_ITEM'}));

myStore.dispatch({
    type: 'ADD_ITEM'
});

// state is [10]
```

### Actions

The actions will manipulate your array in some form or another.

#### Hydrate

This sets the data for your collection. It will override your entire array unless you pass in a `skip` parameter.

```js
function itemReducer(state, action) {
  // reducer stuff
}

const myStore = createStore(
  collectify(
    itemReducer,
    {      
      hydrate: 'HYDRATE_ITEMS'     
    }
  )
);

myStore.dispatch({
    type: 'HYDRATE',
    data: [1, 2, 3, 4] // data is required
});
```

#### Add

This will add an item to your collection. It will default to `itemDefault` if you passed one with your configuration.

```js
function itemReducer(state, action) {
  // reducer stuff
}

const myStore = createStore(
  collectify(
    itemReducer,
    {      
      itemDefault: 10,
      add: 'ADD_ITEM'     
    }
  )
);

myStore.dispatch({
    type: 'ADD_ITEM'
});

// state is [10]

myStore.dispatch({
    type: 'ADD_ITEM',
    data: 11
});

// state is [10, 11]
```

You can pass any [index argument](#indexes) as well.

```js
function itemReducer(state, action) {
  // reducer stuff
}

const myStore = createStore(
  collectify(
    itemReducer,
    { add: 'ADD_ITEM' }
  )
);

myStore.dispatch({
    type: 'ADD_ITEM',
    index: 0,
    data: 2
});

// state is [2]

myStore.dispatch({
    type: 'ADD_ITEM',
    index: 0,
    data: 3
});

// state is [3, 2]
```

#### Add Range

The same as `add`, except this is for adding multiple items at once.

```js
function itemReducer(state, action) {
  // reducer stuff
}

const myStore = createStore(
  collectify(
    itemReducer,
    {      
      itemDefault: 10,
      addRange: 'ADD_MULTIPLE_ITEMS'     
    }
  )
);

myStore.dispatch({
    type: 'ADD_MULTIPLE_ITEMS'
});

// state is [10]

myStore.dispatch({
    type: 'ADD_MULTIPLE_ITEMS',
    data: [11, 12]
});

// state is [10, 11, 12]
```

You can pass any [index argument](#indexes) as well.

```js
function itemReducer(state, action) {
  // reducer stuff
}

const myStore = createStore(
  collectify(
    itemReducer,
    { addRange: 'ADD_MULTIPLE_ITEMS' }
  )
);

myStore.dispatch({
    type: 'ADD_MULTIPLE_ITEMS',
    index: 0,
    data: [2, 3]
});

// state is [2, 3]

myStore.dispatch({
    type: 'ADD_MULTIPLE_ITEMS',
    index: 0,
    data: [4, 5]
});

// state is [4, 5, 2, 3]
```

#### Remove

This will remove items from your collection. If you do not pass a [query](#queries), it will clear the entire collection.

```js
const myStore = createStore(
  collectify(
    [1, 2, 3, 4], // this is a static reducify reducer - defaulting to this array
    {
      hydrate: 'HYDRATE_ITEMS',
      remove: 'REMOVE_ITEMS'
    }
  )
);

myStore.dispatch({
    type: 'REMOVE_ITEMS'
});

// state is []

myStore.dispatch({
    type: 'HYDRATE_ITEMS',
    data: [1, 2, 3, 4]
});

// state is [1, 2, 3, 4]

myStore.dispatch({
    type: 'REMOVE_ITEMS',
    query: item => item > 2
});

// state is [1, 2]

myStore.dispatch({
    type: 'REMOVE_ITEMS',
    query: item => item > 2
});

// state is [1, 2]

myStore.dispatch({
    type: 'REMOVE_ITEMS',
    limit: 1
});

// state is [2]
```

You can pass any [index argument](#indexes) as well.

```js
myStore.dispatch({
    type: 'HYDRATE_ITEMS',
    data: [1, 2, 3, 4]
});

myStore.dispatch({
    type: 'REMOVE_ITEMS',
    index: 0
});

// state is [2, 3, 4]

myStore.dispatch({
    type: 'REMOVE_ITEMS',
    indexes: [0, 2]
});

// state is [3]
```

#### Sort

#### Move

#### Swap

### Queries

### Operations

#### Order

#### After

#### Sort

#### Limit

### Moving and Sorting

### Indexes

## Customization

### Matcher

## Gotchas

## Integration

### With Pipeline

### Without Pipeline

## Credits

Redux Collector is free software under the MIT license. It was created in sunny Santa Monica by [Matthew Drake][].

[Redux]: https://github.com/reactjs/redux
[Matthew Drake]: http://www.mediadrake.com
[Reducify]: http://reducify.mediadrake.com
[Redux Pipeline]: http://redux-pipeline.mediadrake.com

[Redux]: https://github.com/reactjs/redux
[Matthew Drake]: http://www.mediadrake.com
[Reducify]: http://reducify.mediadrake.com
[Redux Pipeline]: http://redux-pipeline.mediadrake.com

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
    {
      add: 'ADD_ITEM',
      hydrate: 'HYDRATE_ITEMS',
      remove: 'REMOVE_ITEM'
    },
    counterReducer
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
      add: 'ADD_ITEM',
      hydrate: 'HYDRATE_ITEMS',
      remove: 'REMOVE_ITEM'
    },
    {
      defaultsTo: 0,
      "INCREMENT": state => state + 1,
      "DECRAMENT": state => state - 1
    }
  )
);
```

This is courtesy of [Reducify][]. Head over to their documentation and check out all the ways you can make reducers. Any argument you pass to collectify gets automatically passed to reducify.

## Features

Basically, you'll get a reducer that does everything you need to arrays. When you call `collectify` you'll get a chance to declare action types for any of the following methods.

### Collectify

```js
collectify([actionTypes<Object>, [itemReducer<Object|Function>, collectionDefault<Array>]]);
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

const myReducer = collectify(actionTypes, itemReducer);
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


const myStore = createStore(collectify({hydrate: 'SET_ITEMS'}, itemReducer));

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

#### Collection Default

This is the default or initial value of the collection.

```js
function itemReducer(state, action) {
  // reducer stuff
}

const myStore = createStore(collectify({}, itemReducer, [1, 2]));

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

const myStore = createStore(collectify({itemDefault: 10, add: 'ADD_ITEM'}, itemReducer));

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
    {      
      hydrate: 'HYDRATE_ITEMS'     
    },
    itemReducer
  )
);

myStore.dispatch({
    type: 'HYDRATE',
    data: [1, 2, 3, 4] // data is required for HYDRATE
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
    {      
      itemDefault: 10,
      add: 'ADD_ITEM'     
    },
    itemReducer
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
    { add: 'ADD_ITEM' },
    itemReducer
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
    {      
      itemDefault: 10,
      addRange: 'ADD_MULTIPLE_ITEMS'     
    },
    itemReducer
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
    { addRange: 'ADD_MULTIPLE_ITEMS' },
    itemReducer
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
    {
      hydrate: 'HYDRATE_ITEMS',
      remove: 'REMOVE_ITEMS'
    },
    [1, 2, 3, 4] // passing in an object and not a function will make this the default value
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

### Moving and Sorting

#### Sort List

Using the same arguments for [sort](#sort), you can modify the output of your list.

```js
// same as above
const myColReducer = collectify(
    {sort: 'SORT'},
    [{ord: 1, value: 3}, {ord: 3, value: 5}, {ord: 2, value: 10}]
);

dispatch({
    type: 'SORT',
    sort: 'ord'
})
// result would be [{ord: 1, value: 3}, {ord: 2, value: 10}, {ord: 3, value: 5}]
```

#### Move

Move lets you take a set of `indexes` passed to a `from` argument and places them at a single indexes provided by a `to` argument.

```js
const myColReducer = collectify(
    {move: 'MOVE', hydrate: 'HYDRATE'},
    [1, 2, 3, 4, 5]
);

dispatch({
    type: 'MOVE',
    from: 1,
    to: 0
})
// result would be [2, 1, 3, 4, 5]

dispatch({
    type: 'HYDRATE',
    data: [1, 2, 3, 4, 5]
})

dispatch({
    type: 'MOVE',
    from: [1, 3], // treated as a list of indexes
    to: 0
})
// result would be [2, 4, 1, 3, 5]

dispatch({
    type: 'HYDRATE',
    data: [1, 2, 3, 4, 5]
})

dispatch({
    type: 'MOVE',
    from: item => item === 3, // treated as a query
    to: item => item === 2 // treated as a query, we will only use the first index returned
})
// result would be [1, 3, 2, 4, 5]

dispatch({
    type: 'HYDRATE',
    data: [1, 2, 3, 4, 5]
})

dispatch({
    type: 'MOVE',
    from: {after: item => item > 1},
    to: 0
})
// result would be [2, 3, 4, 5, 1]
```

#### Swap

Swap switches item by index.

```js
const myColReducer = collectify(
    {move: 'SWAP'},
    [1, 2, 3, 4, 5]
);

dispatch({
    type: 'SWAP',
    indexes: [1, 4]
})
// result would be [1, 5, 3, 4, 2]
```

While most `swap` use cases should just take advantage of `indexes`, you can swap more than one item and have everything move in a carousel.

```js
const myColReducer = collectify(
    {move: 'SWAP'},
    [1, 2, 3, 4, 5]
);

dispatch({
    type: 'SWAP',
    after: item => item === 3
})
// result would be [1, 2, 5, 3, 4]
```

Check out [operations](#operations) for more details.

### Queries

Because we may not always want to change the entire collection, Redux Collector looks for the keyword `query` in your action that you dispatch. This query is processed by the collector matching method.
 
```js
function increment(state = 0, action) {
    switch(action.type) {
        case 'INCREMENT':
            return state + 1;
        default:
            return state;
    }
}

const myStore = createStore(
  collectify(    
    {
        hydrate: 'HYDRATE_LIST' 
    },
    increment
  )
);

myStore.dispatch({
    type: 'HYDRATE_LIST',
    data: [-1, 2, 4]
});

// state is [-1, 2, 4]

myStore.dispatch({
    type: 'INCREMENT',
    query: function(item) {
        return item > 0;
    }
});

// all items are incremented by 1
// state is [-1, 3, 5]
```
 
#### Matcher

By default, the matcher used by `query` and `after` inspects your query argument and compares it against every item in the collection. 

By default, your query is processed as follows:

##### Undefined

If undefined, we assume you want your operation applied to all items in the list.

##### Function

If a function, we evaluate this function passing in `[state, index]`. Returning `true` will say that query matches the item. Returning `false` will say it doesn't.

##### Array

If you pass an array, we will process every item in the query with against `every` (as an **and**, not **or**). For or, use [$or](#or). This is recursive.

##### Or

If you pass an object with the key `$or`, it must have a child that is an array and we will process this against `some`. This is recursive.

```js
myStore.dispatch({
    type: 'INCREMENT',
    query: [
        item => item > 0, 
        item => item % 2 === 0
    ] // all items that are greater than 0 and are even
});

myStore.dispatch({
    type: 'INCREMENT',
    query: {
        $or: [
            item => item > 0, 
            item => item % 2 === 0
        ]
    } // all items that are greater than 0 or are even
});

myStore.dispatch({
    type: 'INCREMENT',
    query: [
        item => item % 2 === 0
        {
            $or: [
                        item => item > 0, 
                        item => item === -2
            ]
        }   
    ] // all items that are even and are either greater than 0 or equal to -2
});
```

#### Boolean

If `true`, we assume you want your operation applied to all truthy items in the list.

If `false`, we assume you want your operation applied to all falsy items in the list.

#### Object

If you pass an object, we'll pass this to the [lodash function](https://lodash.com/docs#isMatch) `_.isMatch` with the item's state as the first argument.

#### Primitive

If you pass any number or string, we will do a strict equals comparison.

#### Custom

It's possible to customize your matcher function. Use the import `{configureCollectify}` and pass in a matcher argument.

```js
import {configureCollectify}

// We pass you the default matcher so you can add functionality without losing default matching behavior
function matcher(item, test, index, defaultMatcher) {
    if (test === 'isOdd') {
        return (item % 2) === 1;
    }
    return defaultMatcher(item, test, index);
}

const myCollectify = configureCollectify({matcher});

const myColReducer = myCollectify(
    {}, 
    incrementReducer,
    [2, 3, 4]
);

dispatch({
    type: 'INCREMENT',
    query: 'isOdd'
})

// result is [2, 4, 4]
```

### Operations

Beyond queries, there are other ways to apply your partial changes to your collection. These should be familiar to anyone with experience in mongo or other collection libraries.

#### Limit

Limits the number of operations your query will execute. This applies to all reducer behavior and `remove`.
 
```js
const myColReducer = collectify(
    {}, 
    incrementReducer,
    [1, 2, 3]
);

dispatch({
    type: 'INCREMENT',
    limit: 1
})
// result would be [2, 2, 3]
```
 
```js
const myColReducer = collectify(
    {remove: 'REMOVE'},
    [1, 2, 3]
);

dispatch({
    type: 'REMOVE',
    limit: 1
})
// result would be [2, 3]
```

#### Skip

Skips a number of items before executing your operation. This applies to all reducer behavior and `remove`.
 
```js
const myColReducer = collectify(
    {}, 
    incrementReducer,
    [1, 2, 3]
);

dispatch({
    type: 'INCREMENT',
    skip: 1
})
// result would be [1, 3, 4]
```

Skip and limit can be combined together.

```js
const myColReducer = collectify(
    {}, 
    incrementReducer,
    [1, 2, 3]
);

dispatch({
    type: 'INCREMENT',
    skip: 1,
    limit: 1
})
// result would be [1, 3, 3]
```

#### Index

A shortcut for `skip = index` and `limit = 1`. Indexes are pythonic, meaning that -1 is equal to the last item in the array.

```js
const myColReducer = collectify(
    {}, 
    incrementReducer,
    [1, 2, 3]
);

dispatch({
    type: 'INCREMENT',
    index: 1
})
// result would be [1, 3, 3]
```

```js
const myColReducer = collectify(
    {}, 
    incrementReducer,
    [1, 2, 3]
);

dispatch({
    type: 'INCREMENT',
    index: -1
})
// result would be [1, 2, 4]
```

#### Indexes

The same as `index`, but should be an array of indexes. Like `index`, these values are pythonic.

```js
const myColReducer = collectify(
    {remove: 'REMOVE'},
    [1, 2, 3]
);

dispatch({
    type: 'REMOVE',
    indexes: [0, 2]
})
// result would be [2]
```

#### Range

Should be a two dimensional array of pythonic indexes of the form `[start, end]`.

```js
const myColReducer = collectify(
    {remove: 'REMOVE'},
    [1, 2, 3, 4]
);

dispatch({
    type: 'REMOVE',
    range: [0, 2]
})
// result would be [4]
```

#### After

Should be a `query` that, upon first match, will determine the `skip` and `limit`.

```js
const myColReducer = collectify(
    {remove: 'REMOVE'},
    [1, 2, 3, 4]
);

dispatch({
    type: 'REMOVE',
    after: (arg, index) => arg === 2
})
// result would be [1, 2]
```

Keep in mind, this is only evaluated once. If the after function returns true, the rest of the collection will have operations applied to it.

#### Sort

Sorts the collection before applying operations to it. This uses the same arguments available for `sort`, but does not actually sort your list. This is useful when used in conjunction with any index operators.

```js

function incrementReducer(state = {value: 0}, action) {
    switch(action.type) {
        case 'INCREMENT':
            return {...state, value: state.value + 1};
        default:
            return state;
    }   
}

const myColReducer = collectify(
    {}, 
    incrementReducer,
    [{ord: 1, value: 3}, {ord: 3, value: 5}, {ord: 2, value: 10}]
);

dispatch({
    type: 'INCREMENT',
    sort: 'ord',
    limit : 2
})
// result would be [{ord: 1, value: 4}, {ord: 3, value: 5}, {ord: 2, value: 11}]
// notice the second element was not changed
```

```js
const myColReducer = collectify(
    {remove: 'REMOVE'},
    [{ord: 1, value: 3}, {ord: 3, value: 5}, {ord: 2, value: 10}]
);

dispatch({
    type: 'REMOVE',
    sort: 'ord',
    limit : 1,
    skip: 1
})
// result would be [{ord: 1, value: 3}, {ord: 3, value: 5}]
```

You can pass a function to `sort` if you need to do something more complicated than just checking against a single key. Keep in mind, that `order` can still flip your collection. If you sort by the negative result of a key, your `order` argument might undo that.

```js
// same as above
const myColReducer = collectify(
    {remove: 'REMOVE'},
    [{ord: 1, value: 3}, {ord: 3, value: 5}, {ord: 2, value: 10}]
);

dispatch({
    type: 'REMOVE',
    sort: item => item.ord,
    limit : 1,
    skip: 1
})
// result would be [{ord: 1, value: 3}, {ord: 3, value: 5}]
```

#### Order

This determines the direction your collections's sorting occurs in. If you do not sort your list, it can be used to just reverse the direction your operations are done in.

```js
const myColReducer = collectify(
    {remove: 'REMOVE'},
    [1, 5, 2]
);

// removes the last item in the list
dispatch({
    type: 'REMOVE',
    order: -1,
    limit : 1
})
// result would be [1, 5]
```

```js
const myColReducer = collectify(
    {remove: 'REMOVE'},
    [{ord: 1, value: 3}, {ord: 3, value: 5}, {ord: 2, value: 10}]
);

dispatch({
    type: 'REMOVE',
    sort: 'ord',
    order : -1
})
// result would be [{ord: 1, value: 3}, {ord: 3, value: 5}]
```

You can combine `order` and `sort` with a shortcut by passing an object to `sort`.

```js
// same as above
const myColReducer = collectify(
    {remove: 'REMOVE'},
    [{ord: 1, value: 3}, {ord: 3, value: 5}, {ord: 2, value: 10}]
);

dispatch({
    type: 'REMOVE',
    sort: {ord: -1}
})
// result would be [{ord: 1, value: 3}, {ord: 3, value: 5}]
```

## Integration

Not every reducer is just a single array. Sometimes your array might be a property on the reducer itself. There's two ways to solve this. 

### With Pipeline

The easy way.

[Redux Pipeline]() can you let select object properties to apply certain reducers to.

It would look something like this:

```js
const myState = {items: []};

function itemReducer(state = 0, action) {
    // reducer
}

const myReducer = pipeline(
    myState,
    {
      $: 'items',
      reducer: collectify({
        add: 'ADD',
        // etc.
      }, itemReducer)
    }
);
```

### Without Pipeline

The slightly more difficult, but not impossible, way.

Track all actions that would apply to your collection and run them through a collectified reducer for that item. It would look like this:

```js
const collectified = collectify({
    add: "ADD"
}, {
    "INCREMENT": state => state + 1
});

function reducer(state = {items: []}, action = {}) {
    switch(action.type) {
        case 'ADD':        
        case 'INCREMENT':
            return {...state, items: collectified(state.items, action)};
        default:
            return state;
    }
}

const store = createStore(reducer);


const {dispatch, getState} = store;
dispatch({type: 'ADD', data: 10});

// state is {items: [10]}

dispatch({type: 'INCREMENT'});
// state is {items: [11]}
```

## Gotchas

### Multiple Aliases

A lot of operations will override behavior of other operations. Mixing them together can lead to odd consequences. We try our best to merge them all, but, when in doubt, either use specific indexes or stick to `skip` and `limit`.

```js
const myColReducer = collectify(
    {}, 
    incrementReducer,
    [1, 2, 3, 4]
);

dispatch({
    type: 'INCREMENT',
    skip: 1,
    index: 0,
    limit 2
})
// result would be [1, 3, 4]
// index just gets ignored
```

### Selectors without pipeline

Redux Collector uses [Reducify]() for your reducer config. This means you can pass any reducer function or a configuration. However, Redux Collector only works on collections, so trying to select something with your configuration will throw an error.

```js
const myState = {items: []};

const myReducer = collectify(
    {},
    {
      $: 'items',
      "INCREMENT": state => state + 1
    },
    myState
);
// throws an error, use pipeline instead
```

If you find yourself selecting something within `collectify`, refer to the [With Pipeline](#with-pipeline) section of this readme.

## Credits

Redux Collector is free software under the MIT license. It was created in sunny Santa Monica by [Matthew Drake][].

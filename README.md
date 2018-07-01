# schematic-fluent

Easily create fluent interfaces

## Installation

```bash
$ yarn add schematic-fluent
```

## Usage

Example with fetch wrapper

```js
import fluent from "schematic-fluent"

// Declare instance creator
const createFetch = fluent({
  methods: {
    from: () => url => ({ url: `/${url}` }),
    get: () => url => ({ method: "GET", url }),
    post: () => url => ({ method: "POST", url }),
    put: () => url => ({ method: "PUT", url }),
    delete: () => url => ({ method: "DELETE", url }),
    paginate: () => (page, limit) => ({ page, limit })
  },
  executors: {
    getOne: ({ url, method }) => id => fetch(`${url}/${id}`, { method: "GET" }),

    getAll: ({ url, page, limit }) => () =>
      fetch(`${url}?page=${page}&limit=${limit}`),

    execute: ({ url, method }) => body => fetch(url, { method, body })
  },
  defaults: () => ({
    page: 1,
    limit: 10
  })
})

// Usage:
createFetch()
  .getOne(1)
  .then(console.log)

createFetch()
  .from("photos")
  .page(1, 10)
  .getAll()
  .then(console.log)

createFetch()
  .post("photos")
  .execute(form)
  .then(console.log)
```

## Explanation

There are 4 parameters:

##### Methods

Method is a function that accepts params and returns object that will be merged with context.  
It adds fluent method to the instance (accepts options and returns the instance)

##### Flags

Same as **methods** but doesn't accept arguments

##### Executors

Executor is a function that accepts params and returns something.  
It adds method to the instance that will return executor result

##### Defaults

Function that declares default context

## Additional

#### getContext()

Returns a shallow clone of context

```js
createFetch()
  .post("photos")
  .getContext() // => { url: '/photos', method: 'POST' }
```

#### clone()

Clones current fluent interface

```js
const a = createFetch().post("photos")

const b = a.clone()
b.post("blog")

b.getContext()
// => { url: '/blog', method: 'POST' }

a.getContext()
// => { url: '/photos', method: 'POST' }
```

#### extend()

You can extend fluent instances with new flags/methods/executors.

```js
const something = fluent({
  methods: {
    foo: () => foo => ({ foo })
  }
})

const instance = something().foo("bar")

const withBaz = instance.extend({
  methods: {
    baz: () => baz => ({ baz })
  }
})

instance.baz("lol")
instance.getContext() // => { foo: 'bar', baz: 'lol' }
```

#### Static extend (0.4.0+)

Like previous `.extend()` but without initialized instance:

```js
const something = fluent({
  methods: {
    foo: () => foo => ({ foo })
  }
})

const withBaz = something.extend({
  methods: {
    baz: () => baz => ({ baz })
  }
})

withBaz()
  .foo("bar")
  .baz("lol")
  .getContext() // => { foo: 'bar', baz: 'lol' }
```

#### `immutable` flag (0.4.0+)

You can add `immutable: true` for schema.  
With this flag, each method called will clone fluent instance:

```js
const createFoo = fluent({
  immutable: true,
  methods: {
    foo: () => foo => ({ foo })
  }
})

const Root = createFoo()
const Bar = root.foo("bar")

Root.getContext() // => {}
Bar.getContext() // { foo: 'bar' }
```

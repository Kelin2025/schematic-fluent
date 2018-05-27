# schematic-fluent

Easily create fluent interfaces

## Installation

```bash
$ yarn add schematic-fluent
```

## Usage

### Create an instance

Example with fetch wrapper

```js
import fluent from "schematic-fluent"

const createFetch = fluent({
  methods: {
    from: url => ({ url }),
    get: url => ({ method: "GET", url }),
    post: url => ({ method: "POST", url }),
    put: url => ({ method: "PUT", url }),
    delete: url => ({ method: "DELETE", url }),
    paginate: (page, limit) => ({ page, limit })
  },
  executors: {
    getOne: (id, { url, method }) => 
      fetch(`${url}/${id}`, { method: "GET" }),

    getAll: ({ url, page, limit }) =>
      fetch(`${url}?page=${page}&limit=${limit}`),

    execute: (body, { url, method }) => 
      fetch(url, { method, body })
  },
  defaults: () => ({
    page: 1,
    limit: 10
  })
})
```

### Explanation

There are 3 params:

##### Methods

Method is a function that accepts params and returns object that will be merged with context.  
It adds fluent method to the instance (accepts options and returns the instance)

##### Executors

Executor is a function that accepts params and returns something.  
It adds method to the instance that will return executor result

##### Defaults

Function that declares default context. It's optional parameter

> **NOTE:** both methods and executors accepts context as additional last argument.

### Use instance

```js
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

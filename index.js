const fluent = ({ methods, executors, flags, defaults }) => () => {
  const ctx = defaults ? defaults() : {}
  const res = {}

  for (const [flag, cb] of Object.entries(flags)) {
    Object.defineProperty(res, flag, {
      get() {
        cb(ctx)
        return res
      }
    })
  }

  for (const [method, cb] of Object.entries(methods)) {
    res[method] = (...args) => {
      Object.assign(ctx, cb(ctx)(...args))
      return res
    }
  }

  for (const [method, cb] of Object.entries(executors)) {
    res[method] = (...args) => cb(ctx)(...args)
  }

  res.getContext = () => ({ ...ctx })

  res.clone = () =>
    fluent({
      methods,
      executors,
      defaults: res.getContext
    })()

  return res
}

export default fluent

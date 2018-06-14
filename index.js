const fluent = ({ methods, executors, flags, defaults }) => () => {
  const ctx = defaults ? defaults() : {}
  const res = {}

  for (const [flag, cb] of Object.entries(flags)) {
    Object.defineProperty(res, flag, {
      get() {
        Object.assign(ctx, cb(ctx))
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
      flags,
      methods,
      executors,
      defaults: res.getContext
    })()

  res.extend = extension =>
    fluent({
      flags: { ...flags, ...extension.flags },
      methods: { ...methods, ...extension.methods },
      executors: { ...executors, ...extension.executors },
      defaults: () => ({
        ...(defaults && defaults()),
        ...(extension.defaults && extension.defaults())
      })
    })

  return res
}

export default fluent

const fluent = ({
  flags = {},
  methods = {},
  defaults,
  executors = {},
  immutable = false
}) => {
  const createInstance = initContext => {
    const ctx =
      initContext !== undefined ? initContext : defaults ? defaults() : {}
    const res = {}

    const apply = diff => {
      if (immutable) {
        return res.clone(Object.assign(res.getContext(), diff))
      }
      Object.assign(ctx, diff)
      return res
    }

    const additional = {
      flag: flag => {
        res[flag]
        return {}
      },
      method: method => (...args) => {
        res[method](...args)
        return {}
      }
    }

    for (const [flag, cb] of Object.entries(flags)) {
      Object.defineProperty(res, flag, {
        get() {
          return apply(cb(ctx, additional))
        }
      })
    }

    for (const [method, cb] of Object.entries(methods)) {
      res[method] = (...args) => {
        return apply(cb(ctx, additional)(...args))
      }
    }

    for (const [method, cb] of Object.entries(executors)) {
      res[method] = (...args) => cb(ctx)(...args)
    }

    res.getContext = () => ({ ...ctx })

    res.clone = newContext =>
      fluent({
        flags,
        methods,
        executors,
        immutable,
        defaults: res.getContext
      })(newContext)

    res.extend = extension =>
      createInstance.extend({ ...extension, defaults: res.getContext })()

    return res
  }

  createInstance.extend = extension =>
    fluent({
      flags: { ...flags, ...extension.flags },
      methods: { ...methods, ...extension.methods },
      executors: { ...executors, ...extension.executors },
      immutable: "immutable" in extension ? extension.immutable : immutable,
      defaults: () => ({
        ...(defaults && defaults()),
        ...(extension.defaults && extension.defaults())
      })
    })

  return createInstance
}

module.exports = fluent

import { get as objGet } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { isFunction, slugifyFormID } from './schema'
import { computed } from '@vue/composition-api'

export default function abstractFields (context) {
  const attributesDirective = (el, binding, vnode) => {
    let attrs = objGet(vnode.context, 'schema.attributes', {})
    const container = binding.value || 'input'
    if (typeof container === 'string') {
      attrs = objGet(attrs, container) || attrs
    }

    attrs.forEach((val, key) => {
      el.setAttribute(key, val)
    })
  }

  const getFieldID = (schema, unique = false) => {
    const idPrefix = context.formOptions?.fieldIdPrefix

    return slugifyFormID(schema, idPrefix) + (unique ? '-' + uuidv4() : '')
  }

  const setModelValueByPath = (path, value) => {
    // convert array indexes to properties
    let s = path.replace(/\[(\w+)\]/g, '.$1')

    // strip a leading dot
    s = s.replace(/^\./, '')

    let o = context.model
    const a = s.split('.')
    let i = 0
    const n = a.length

    while (i < n) {
      const k = a[i]
      if (i < n - 1) {
        if (o[k] !== undefined) {
        // Found parent property. Step in
          o = o[k]
        } else {
        // Create missing property (new level)
          context.$set(o, k, {})
          o = o[k]
        }
      } else {
        // Set final property value
        context.$set(o, k, value)

        return
      }

      ++i
    }
  }

  const updateModelValue = (newValue, oldValue) => {
    let changed = false
    if (isFunction(context.schema.set)) {
      context.schema.set(context.model, newValue)
      changed = true
    } else if (context.schema.model) {
      setModelValueByPath(context.schema.model, newValue)
      changed = true
    }

    if (changed) {
      context.$emit('model-updated', newValue, context.schema.model)

      if (isFunction(context.schema.onChanged)) {
        context.schema.onChanged.call(this, context.model, newValue, oldValue, context.schema)
      }
    }
  }

  const value = computed({
    get () {
      let val
      if (isFunction(this.schema?.get)) {
        val = this.schema.get(this.model)
      } else {
        val = this.model || this.schema.model
      }

      return val
    },

    set (newValue) {
      const oldValue = value.value

      if (isFunction(newValue)) {
        (newValue as Function)(newValue, oldValue)
      } else {
        updateModelValue(newValue, oldValue)
      }
    }
  })

  return {
    value,
    getFieldID,
    attributesDirective
  }
}

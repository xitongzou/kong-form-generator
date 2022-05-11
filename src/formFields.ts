import { isFunction } from './schema'

export default function formFields (context) {
  const fieldDisabled = (field) => {
    if (isFunction(field.disabled)) return field.disabled.call(this, context.model, field, this)

    return field.disabled ?? false
  }
  const fieldReadonly = (field) => {
    if (isFunction(field.readonly)) return field.readonly.call(this, context.model, field, this)

    return field.readonly ?? false
  }
  const fieldFeatured = (field) => {
    if (isFunction(field.featured)) return field.featured.call(this, context.model, field, this)

    return field.featured ?? false
  }
  const fieldRequired = (field) => {
    if (isFunction(field.required)) return field.required.call(this, context.model, field, this)

    return field.required ?? false
  }
  const fieldErrors = (field) => {
    const res = context.errors.filter(e => e.field === field)

    return res.map(item => item.error)
  }
  const getFieldRowClasses = (field) => {
    const baseClasses = {
      disabled: fieldDisabled(field),
      readonly: fieldReadonly(field),
      featured: fieldFeatured(field),
      required: fieldRequired(field)
    }

    if (Array.isArray(field.styleClasses)) {
      field.styleClasses.forEach(c => (baseClasses[c] = true))
    } else if (field.styleClasses instanceof String) {
      baseClasses[field.styleClasses] = true
    }

    if (field.type) {
      baseClasses['field-' + field.type] = true
    }

    if (field.inputType === 'hidden') {
      baseClasses['d-none'] = true
    }

    if (field.styleClasses && typeof field.styleClasses === 'string') {
      baseClasses[field.styleClasses] = true
    }

    return baseClasses
  }

  return {
    getFieldRowClasses,
    fieldDisabled,
    fieldErrors,
    fieldReadonly,
    fieldFeatured,
    fieldRequired
  }
}

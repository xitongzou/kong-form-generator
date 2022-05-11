<template>
  <div
    v-if="formSchema"
    data-testid="kong-form-generator"
    class="kong-form-generator"
  >
    <fieldset
      :is="tag"
      v-if="formSchema.fields"
    >
      <div
        v-for="(field, idx) in fields"
        :key="idx"
      >
        <KongFormGroup
          :field="field"
          :errors="errors"
          :model="model"
          :options="options"
          @model-updated="updateModel"
          @input-updated="updateInput"
        />
      </div>
    </fieldset>
    <fieldset
      :is="tag"
      v-else-if="fields && fields.length > 0"
    >
      <div
        v-for="(field, idx) in formSchema"
        :key="idx"
      >
        <KongFormGroup
          :field="field"
          :errors="errors"
          :model="model"
          :options="options"
          @model-updated="updateModel"
          @input-updated="updateInput"
        />
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api'
import formFields from './formFields'

type KongFormGeneratorOptions = {
  validateAfterLoad: boolean
  validateAfterChanged: boolean
  fieldIdPrefix: string
  validateAsync: boolean
  validationErrorClass: string
  validatationSuccessClass: string
}

export default defineComponent({
  name: 'KongFormGenerator',
  props: {
    schema: {
      type: Object,
      required: true
    },

    model: {
      type: Object,
      default () {
        return {}
      }
    },

    options: {
      type: Object as PropType<KongFormGeneratorOptions>,
      default () {
        return {
          validateAfterLoad: false,
          validateAfterChanged: false,
          fieldIdPrefix: '',
          validateAsync: false,
          validationErrorClass: 'error',
          validationSuccessClass: ''
        }
      }
    },

    multiple: {
      type: Boolean,
      default: false
    },

    isNewModel: {
      type: Boolean,
      default: false
    },

    tag: {
      type: String,
      default: 'fieldset',
      validator: function (value: string) {
        return value.length > 0
      }
    }
  },
  setup (props, { emit, root }) {
    const { multiple, schema: formSchema, options } = props
    const errors = []

    const fields = computed(() => {
      const res = []

      if (formSchema && formSchema.fields) {
        formSchema.fields.forEach(field => {
          if (field && (!multiple || field.multi === true)) res.push(field)
        })
      }

      return res
    })

    const groups = computed(() => {
      const res = []

      if (formSchema && formSchema.groups) {
        formSchema.groups.slice(0).forEach(group => {
          res.push(group)
        })
      }

      return res
    })

    const updateModel = (value, name) => {
      emit('model-updated', value, name)
    }

    const updateInput = (value, model, inputType) => {
      emit('input-updated', value, model, inputType)
    }

    const { getFieldRowClasses } = formFields({
      errors,
      options
    })

    return {
      fields,
      formSchema,
      errors,
      groups,
      getFieldRowClasses,
      updateModel,
      updateInput
    }
  }
})
</script>

<style lang="scss">
.kong-form-generator {
  * {
    box-sizing: border-box;
  }

  .form-control {
    // Default Bootstrap .form-control style
    display: block;

    &:not([class*=" col-"]) {
      width: 100%;
    }

    padding: 6px 12px;
    font-size: var(--type-sm);
    line-height: 1.42857143;
    color: var(--grey-600);
    background-color: var(--white);
    background-image: none;
    border: 1px solid var(--grey-300);
    border-radius: 4px;
    box-shadow: inset 0 1px 1px var(--black-70);
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  } // .form-control

  span.help,
  p.help {
    margin-left: 0.3em;
    position: relative;
    font-style: italic;

    .icon {
      display: inline-block;
      width: 16px;
      height: 14px;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAA+UlEQVQ4ja3TS0oDQRAG4C8+lq7ceICICoLGK7iXuNBbeAMJuPVOIm7cqmDiIncIggg+cMZFaqCnZyYKWtB0df31V1VXdfNH6S2wD9CP8xT3KH8T9BiTcE7XBMOfyBcogvCFO9ziLWwFRosyV+QxthNsA9dJkEYlvazsQdi3sBv6Ol6TBLX+HWT3fcQZ3vGM5fBLk+ynAU41m1biCXvhs4OPBDuBpa6GxF0P8YAj3GA1d1qJfdoS4DOIcIm1DK9x8iaWeDF/SP3QU6zRROpjLDFLsFlibx1jJaMkSIGrWKntvItcyTBKzCcybsvc9ZmYz3kz9Ooz/b98A8yvW13B3ch6AAAAAElFTkSuQmCC");
      background-repeat: no-repeat;
      background-position: center center;
    } // .icon

    .helpText {
      background-color: #444;
      bottom: 30px;
      color: var(--white);
      display: block;
      left: 0px;
      opacity: 0;
      padding: 20px;
      pointer-events: none;
      position: absolute;
      text-align: justify;
      width: 300px;
      transition: all 0.25s ease-out;
      box-shadow: 2px 2px 6px var(--black-45);
      border-radius: 6px;

      a {
        font-weight: bold;
        text-decoration: underline;
      } // a
    } // .helpText

    /* This bridges the gap so you can mouse into the tooltip without it disappearing */
    .helpText:before {
      bottom: -20px;
      content: " ";
      display: block;
      height: 20px;
      left: 0;
      position: absolute;
      width: 100%;
    }

    &:hover .helpText {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0px);
    }
  } // span.help

  .field-wrap {
    display: flex;

    .buttons {
      white-space: nowrap;
      margin-left: 4px;
    }
  } // .field-wrap
  .hint {
    font-style: italic;
    font-size: 0.8em;
  } // .hint
} // fieldset
</style>

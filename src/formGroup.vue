<template>
  <div
    v-if="formField && formField.visible ? formField.visible(formModel) : true"
    class="form-group"
    data-testid="kong-form-group"
    :class="getFieldRowClasses(formField)"
  >
    <KLabel
      v-if="formField.label && !['textArea', 'select', 'checkbox', 'switch', 'input'].includes(formField.type)"
      data-testid="formfield-label"
      :help="formField.help"
    >
      {{ formField.label }}
    </KLabel>

    <div class="field-wrap">
      <div v-if="formField.inputType === 'hidden'">
        <input
          type="hidden"
          data-testid="formfield-hidden"
          :name="formField.default"
        >
      </div>

      <KInput
        v-else-if="formField.type === 'input'"
        :id="formField.name"
        v-model="transformedInput"
        :required="formField.required || null"
        data-testid="formfield-input"
        class="formfield-input"
        :label="formField.label"
        :placeholder="formField.placeholder"
        :name="formField.name"
        :type="formField.inputType"
        :label-attributes="{
          help: formField.help
        }"
        @input="(val) => updateInput(val, formField.model, field.inputType)"
      />

      <KSelect
        v-else-if="formField.type === 'select'"
        v-model="transformedInput"
        :required="formField.required || null"
        data-testid="formfield-select"
        class="formfield-select"
        :items="mappedItems"
        :label="formField.label"
        appearance="select"
        :label-attributes="{
          help: formField.help
        }"
      />

      <div v-else-if="formField.type === 'radio'">
        <div
          v-for="option in formField.items"
          :key="option.label"
          class="formfield-radio"
        >
          <KRadio
            v-model="formModel[field.model]"
            class="formfield-radio-option"
            data-testid="formfield-radio-option"
            :name="formField.name"
          >
            {{ option.label }}
          </KRadio>
        </div>
      </div>

      <KCheckbox
        v-else-if="formField.type === 'checkbox'"
        v-model="formModel[field.model]"
        class="formfield-checkbox"
        data-testid="formfield-checkbox"
        :required="formField.required || null"
        :name="formField.model"
      >
        {{ formField.label }}
      </KCheckbox>

      <KTextArea
        v-else-if="formField.type === 'textArea'"
        :id="formField.name"
        v-model="formModel[field.model]"
        class="formfield-textarea"
        data-testid="formfield-textarea"
        :required="formField.required || null"
        :name="formField.name"
        :label="formField.label"
        :label-attributes="{
          help: formField.help
        }"
      />

      <KfgArray
        v-else-if="formField.type === 'metric'"
        class="formfield-array-metric"
        data-testid="formfield-array-metric"
        :model="formModel[field.model]"
        :schema="formField"
        type="metric"
        @model-updated="updateModel"
      />

      <KfgAdvanced
        v-else-if="formField.type === 'advanced'"
        class="formfield-array-advanced"
        data-testid="formfield-array-advanced"
        :model="formModel"
        :schema="formField"
      />

      <KfgArray
        v-else-if="formField.type === 'array_card_container'"
        class="formfield-array-card-container"
        data-testid="formfield-array-card-container"
        :model="formModel[field.model]"
        :schema="formField"
        type="array_card_container"
        @model-updated="updateModel"
      />

      <KfgAutoSuggest
        v-else-if="formField.type === 'AutoSuggest'"
        class="formfield-autosuggest"
        data-testid="formfield-autosuggest"
        :model="formField"
        :schema="formField"
        :prepopulated-data="formModel[field.model] || ''"
        @model-updated="updateModel"
      />

      <KfgArray
        v-else-if="formField.type === 'array'"
        class="formfield-array-item"
        data-testid="formfield-array-item"
        :model="formModel[field.model]"
        :schema="formField"
        type="array_item"
        @model-updated="updateModel"
      />

      <KfgArrayMultiItem
        v-else-if="formField.type === 'array_multi'"
        class="formfield-array-multi"
        data-testid="formfield-array-multi"
        :model="formModel[field.model]"
        :schema="formField"
      />

      <KfgObjectAdvanced
        v-else-if="formField.type === 'object-advanced'"
        class="formfield-object-advanced"
        data-testid="formfield-object-advanced"
        :model="formModel[field.model]"
        :prepopulated-value="prepopulatedObjAdvVal"
        :schema="formField"
        @model-updated="updateModel"
      />

      <KfgSelectionGroup
        v-else-if="formField.type === 'selectionGroup' || formField.model === 'selectionGroup'"
        class="formfield-selection-group"
        data-testid="formfield-selection-group"
        :model="formModel[field.model]"
        :schema="formField"
        @model-updated="updateModel"
      />

      <KInputSwitch
        v-else-if="formField.type === 'switch'"
        v-model="formModel[field.model]"
        class="formfield-switch"
        data-testid="formfield-switch"
        :label="formModel.enabled ? 'This plugin is Enabled' : 'This plugin is Disabled'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onBeforeMount } from '@vue/composition-api'
import formFields from './formFields'
import KfgAdvanced from './KfgAdvanced.vue'
import KfgAutoSuggest from './KfgAutoSuggest.vue'
import KfgArray from './KfgArray.vue'
import KfgArrayMultiItem from './KfgArrayMultiItem.vue'
import KfgObjectAdvanced from './KfgObjectAdvanced.vue'
import KfgSelectionGroup from './KfgSelectionGroup.vue'
import { cloneDeep } from '@KHCP/helpers'

export default defineComponent({
  name: 'KongFormGroup',
  components: {
    KfgAdvanced,
    KfgAutoSuggest,
    KfgArray,
    KfgArrayMultiItem,
    KfgObjectAdvanced,
    KfgSelectionGroup
  },

  props: {
    model: {
      type: Object,
      required: true
    },

    options: {
      type: Object,
      default: () => {}
    },

    field: {
      type: Object,
      required: true
    },

    errors: {
      type: Array,
      default: () => []
    }
  },

  setup (props, { root, emit }) {
    const errors = []
    const formField = props.field
    const formModel = props.model
    const fieldModel = props.field.model
    const prepopulatedObjAdvVal = ref({})
    const { options, model } = props
    let val = formModel[fieldModel] ? cloneDeep(formModel[fieldModel]) : null

    if (val && (formField.type === 'input' || formField.type === 'select') && Array.isArray(val)) {
      val = val.join(',')
    }

    const transformedInput = ref(val)

    watch(transformedInput, () => {
      formModel[fieldModel] = transformedInput.value
    })

    const updateModel = (value, name) => {
      emit('model-updated', value, name)
    }

    const updateInput = (value, model, inputType) => {
      emit('input-updated', value, model, inputType)
    }

    const mappedItems = formField.values ? formField.values.map(item => {
      const mappedObj = {
        label: item + '',
        value: item
      } as any

      let compareVal = item
      let defaultVal = transformedInput.value ? transformedInput.value : formField.default

      if (Array.isArray(compareVal)) {
        compareVal = compareVal.join(',')
      } else if (typeof compareVal === 'object') {
        compareVal = JSON.stringify(compareVal)
      }

      if (Array.isArray(defaultVal)) {
        defaultVal = defaultVal.join(',')
      } else if (typeof defaultVal === 'object') {
        defaultVal = JSON.stringify(defaultVal)
      }

      if (compareVal === defaultVal) {
        mappedObj.selected = true
      }

      return mappedObj
    }) : []

    const { fieldErrors, getFieldRowClasses } = formFields({
      model,
      errors,
      options
    })

    // this has to be set in beforeMount in order to pass the correct updated value to KFGObjectAdvanced
    onBeforeMount(() => {
      Object.keys(formModel).forEach(field => {
        if (field.indexOf('headers-') !== -1) {
          const headerName = field.split('headers-')[1]

          prepopulatedObjAdvVal.value[headerName] = formModel[field]
        }
      })

      const schemaFields = formField.items?.schema?.fields?.map(field => field.model)

      // Make sure every KFGMetric sub-field has all the properties of the schema since some fields may be inconsistent coming from the backend
      if (schemaFields) {
        formField?.default?.forEach(field => {
          schemaFields.forEach(schemaField => {
            !(schemaField in field) && (field[schemaField] = null)
          })
        })
      }
    })

    return {
      getFieldRowClasses,
      fieldErrors,
      formField,
      formModel,
      mappedItems,
      updateModel,
      transformedInput,
      prepopulatedObjAdvVal,
      updateInput
    }
  }
})
</script>

<style lang="scss">
$errorColor: var(--red-500);

.form-group:not([class*=" col-"]) {
  width: 100%;
}

.form-group {
  display: inline-block;
  vertical-align: top;
  margin-bottom: 1rem;

  .field-wrap {
    width: 80%;

    .formfield-input,
    .formfield-select,
    .formfield-array-metric,
    .formfield-array-card-container {
      width: 75% !important;
    }

    .formfield-checkbox {
      margin-top: 24px !important;
    }

    .k-select .k-select-input {
      height: 36px;
    }
  }

  label {
    font-weight: 400;

    & > :first-child {
      display: inline-block;
    }
  }

  &.featured {
    > label {
      font-weight: bold;
    }
  }

  &.required {
    > label:after {
      content: "*";
      font-weight: normal;
      color: Red;
      padding-left: 0.2em;
      font-size: 1em;
    }
  }

  &.disabled {
    > label {
      color: #666;
      font-style: italic;
    }
  }

  &.error {
    input:not([type="checkbox"]),
    textarea,
    select {
      border: 1px solid $errorColor;
      background-color: rgba($errorColor, 0.15);
    }

    .errors {
      color: $errorColor;
      font-size: 0.8em;

      span {
        display: block;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiklEQVR4Xt2TMQoCQQxF3xdhu72MpZU3GU/meBFLOztPYrVWsQmEWSaMsIXgK8P8RyYkMjO2sAN+K9gTIAmDAlzoUzE7p4IFytvDCQWJKSStYB2efcAvqZFM0BcstMx5naSDYFzfLhh/4SmRM+6Agw/xIX0tKEDFufeDNRUc4XqLRz3qabVIf3BMHwl6Ktexn3nmAAAAAElFTkSuQmCC");
        background-repeat: no-repeat;
        padding-left: 17px;
        padding-top: 0px;
        margin-top: 0.2em;
        font-weight: 600;
      }
    }
  }
}
</style>

<template>
  <div class="selection-group w-100">
    <div
      v-for="(option, i) in schema.fields"
      :key="i"
      class="option-group"
    >
      <!-- Radio button -->
      <div class="form-group mb-0">
        <KRadio
          v-model="checkedGroup"
          :value="i"
          @change="updateFields"
        >
          {{ option.label }}
          <div class="control-help">
            {{ option.description }}
          </div>
        </KRadio>
      </div>

      <!-- Selected Field -->
      <div
        v-show="option.fields && checkedGroup === i"
        class="option-field"
      >
        <div class="mb-0">
          <KongFormGenerator
            :schema="{ fields: option.fields }"
            :model="model"
            @model-updated="updateModel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted, nextTick } from '@vue/composition-api/dist/vue-composition-api'

export default defineComponent({
  name: 'KfgSelectionGroup',

  props: {
    model: {
      type: Object,
      default () {
        return {}
      }
    },
    schema: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  setup (props, { root, emit }) {
    const checkedGroup = ref(0)
    let fieldModel = { ...props.model }
    const fieldSchema = ref([])
    const oldValue = JSON.parse(JSON.stringify(checkedGroup.value))

    const updateModel = (value, name) => {
      emit('model-updated', value, name)
    }

    const updateFields = (val) => {
      const newFields = props.schema.fields[val].fields
      const oldFields = props.schema.fields[checkedGroup.value].fields

      oldFields && oldFields.forEach(field => updateModel('', field.model))
      newFields && newFields.forEach(field => updateModel(fieldModel[field.model], field.model))
    }

    watch(checkedGroup, (newVal, oldVal) => {
      if (oldValue === null || oldValue === undefined) {
        fieldModel = { ...props.model }

        return
      }

      const newFields = props.schema.fields[newVal].fields
      const oldFields = props.schema.fields[oldVal].fields

      oldFields && oldFields.forEach(field => updateModel('', field.model))
      newFields && newFields.forEach(field => updateModel(fieldModel[field.model], field.model))
    })

    onMounted(async () => {
      await nextTick()

      // Set checkedGroup based on model
      props.schema.fields.forEach((field, i) => {
        field.fields && field.fields.forEach(subField => {
          if (props.model[subField.model]) {
            checkedGroup.value = i
            fieldSchema.value.push(subField.model)
          }
        })
      })

      if (checkedGroup.value === null) {
        checkedGroup.value = 0
      }
    })

    return {
      checkedGroup,
      updateModel,
      updateFields
    }
  }
})
</script>

<style lang="scss">
.field-selectionGroup {
  > label {
    display: none;
  }
  .control-help {
    width: 100%;
    margin-left:2rem;
    font-weight: normal;
    color: var(--black-45);
  }
  .form-check-input {
    margin-right: .5rem;
    margin-bottom: .5rem;
  }
  .option-field {
    margin-top: 1rem;
    .form-group {
      margin-bottom: 1rem;
    }
  }
}
</style>

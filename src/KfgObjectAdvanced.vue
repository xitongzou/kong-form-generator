<template>
  <div
    v-if="schema"
    :id="getFieldID(schema)"
    :class="schema.fieldClasses"
    class="w-75 kfg-object-advanced"
  >
    <div
      v-for="(item, index) in value"
      :key="index"
      :data-testid="`field-object-key-${index}`"
    >
      <div>
        <div class="ml-5">
          <div class="justify-content-between align-items-center d-flex mt-1">
            <strong>{{ index }}</strong>
            <div>
              <KButton
                appearance="btn-link"
                class="delete non-visual-button"
                type="button"
                @click="removeElement(index, schema.model)"
              >
                <KIcon
                  slot="icon"
                  size="16"
                  icon="trash"
                  color="var(--red-500)"
                />
              </KButton>
            </div>
          </div>
          <hr class="my-2">
          <div v-if="!subSchema || (subSchema && subSchema[0].inputType === 'text')">
            <KInput
              v-model="value[index]"
              :help="schema.fields && schema.fields[0].hint"
              :placeholder="schema.fields && schema.fields[0].placeholder"
              class="form-control w-100"
              type="text"
              @input="updateModel(schema.model)"
            />
          </div>
          <hr class="my-4">
        </div>
      </div>
    </div>
    <div :class="{'ml-5': hasObjectKeys}">
      <KInput
        v-model="newKeyName"
        :placeholder="schema.placeholder"
        class="form-control w-100"
        type="text"
        data-testid="keyname-input"
        required
        :help="schema.hintText"
      />
      <KButton
        :disabled="!newKeyName"
        class="d-flex"
        data-testid="add-key"
        appearance="outline"
        icon="plus"
        @click="addKey"
      >
        Add {{ schema.buttonLabel || schema.label }}
      </KButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import Vue from 'vue'
import abstractFields from './abstractFields'
import { cloneDeep } from '@KHCP/helpers'

export default defineComponent({
  name: 'KfgObjectAdvanced',
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
      },
      required: true
    },
    formOptions: {
      type: Object,
      default () {
        return {}
      }
    },
    prepopulatedValue: {
      type: Object,
      default: null
    }
  },
  setup (props, { root, emit }) {
    const newKeyName = ref('')
    const subSchema = computed(() => props.schema.fields)

    const prepopulatedValue = cloneDeep(props.prepopulatedValue)

    Object.keys(prepopulatedValue).forEach(val => {
      prepopulatedValue[val] = prepopulatedValue[val].join(',')
    })

    const value = ref(prepopulatedValue)

    const { getFieldID } = abstractFields({
      formOptions: props.formOptions,
      schema: props.schema,
      model: props.model,
      $set: root.$set,
      $emit: emit
    })
    const hasObjectKeys = computed(() => value.value && Object.keys(value.value).length > 0)

    const removeElement = (index, schema) => {
      Vue.delete((value.value as Object), index)
      const modelValue = cloneDeep(value.value)

      emit('model-updated', modelValue, schema)
    }

    const addKey = () => {
      const type = subSchema.value && subSchema.value[0]?.value ? {} : ''

      root.$set(value.value, newKeyName.value, type)
      newKeyName.value = ''
    }

    const updateModel = (schema) => {
      // The backend expects an array to be sent
      const modelValue = cloneDeep(value.value)

      Object.keys(value.value).forEach(val => {
        modelValue[val] = modelValue[val].split(',')
      })

      emit('model-updated', modelValue, schema)
    }

    return {
      value,
      getFieldID,
      addKey,
      removeElement,
      subSchema,
      updateModel,
      hasObjectKeys,
      newKeyName
    }
  }
})
</script>

<style lang="scss">
.kong-form-generator {
  .formfield-object-advanced.kfg-object-advanced {
    .k-input-wrapper.form-control {
      box-shadow: none !important;
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>

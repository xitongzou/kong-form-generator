<template>
  <div
    v-if="schema"
    :id="getFieldID(schema)"
    :class="schema.fieldClasses"
  >
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="schema.fieldItemsClasses"
    >
      <KfgArrayCardContainer
        v-if="type === 'array_card_container' && schema.items && schema.itemContainerComponent"
        :model="item"
        :index="index"
        :schema="schema"
        :prepopulated-value="cardContainerModel"
        @model-updated="updateModel"
        @removeItem="removeElement(index)"
      />
      <KfgMetric
        v-else-if="type === 'metric' && schema.items.default"
        :id="item.name"
        :model="item"
        :schema="schema.items.schema"
        @model-updated="updateModel"
        @removeItem="removeElement(index)"
      />
      <KfgArrayItem
        v-else-if="type === 'array_item'"
        :model="item.value"
        @removeItem="removeElement(index)"
      >
        <KInput
          v-if="schema.inputType === 'text'"
          v-model="item.value"
          :class="schema.inputAttributes.class"
          :placeholder="schema.inputAttributes.placeholder"
          :name="schema.model"
          @input="updateModel"
        />
      </KfgArrayItem>
    </div>

    <KButton
      :class="schema.newElementButtonLabelClasses"
      :data-testid="`add-${getFieldID(schema)}`"
      appearance="outline"
      @click="newElement"
    >
      <template #icon>
        <KIcon
          icon="plus"
          color="var(--blue-500)"
          size="16"
        />
      </template>
      {{ schema.newElementButtonLabel || newElementButtonLabel }}
    </KButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import abstractFields from './abstractFields'
import { isFunction, cloneDeep } from './schema'
import KfgArrayCardContainer from './KfgArrayCardContainer.vue'
import KfgMetric from './KfgMetric.vue'
import KfgArrayItem from './KfgArrayItem.vue'
import KInput from '@kongponents/kinput/KInput.vue'

export default defineComponent({
  name: 'KfgArray',
  components: { KfgArrayCardContainer, KfgMetric, KfgArrayItem, KInput },
  props: {
    newElementButtonLabel: {
      type: String,
      default: 'New Item'
    },
    removeElementButtonLabel: {
      type: String,
      default: 'x'
    },
    model: {
      type: [Object, Array],
      default: () => {}
    },
    schema: {
      type: Object,
      required: true
    },
    formOptions: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'array_card_container',
      validator: (value) => ['array_card_container', 'metric', 'array_item'].indexOf(value as string) !== -1
    }
  },
  setup (props, { root, emit }) {
    const items = ref([])
    const cardContainerModel = ref([])
    if (props.type === 'metric') {
      items.value = cloneDeep(props.schema.default)
    }

    const generateSchema = (rootValue, schema, index) => {
      let copy
      if (schema) {
        copy = JSON.parse(JSON.stringify(schema))
        copy.schema.fields.map(field => {
          field.id = `${field.id || field.model}-${index}`
        })
      }

      return {
        ...copy,
        set (model, value) {
          Vue.set(rootValue, index, value)
        },
        get (model) {
          return rootValue[index]
        }
      }
    }
    const { value, getFieldID } = abstractFields({
      formOptions: props.formOptions,
      schema: props.schema,
      model: props.model,
      $set: root.$set,
      $emit: emit
    })
    const newElement = () => {
      if (props.type === 'array_item') {
        items.value.push({ value: '' })
      } else {
        let itemsDefaultValue = props.schema.items.schema
        if (props.schema.items && props.schema.items.default) {
          if (isFunction(props.schema.items.default)) {
            itemsDefaultValue = props.schema.items.default()
          } else {
            itemsDefaultValue = props.schema.items.default
          }
        }

        items.value.push(itemsDefaultValue)
      }
    }
    const removeElement = (index) => {
      items.value = items.value.filter((item, idx) => idx !== index)

      if (props.type === 'array_card_container') {
        cardContainerModel.value = cardContainerModel.value.filter((item, idx) => idx !== index)

        emit('model-updated', cardContainerModel.value, props.schema.model)
      } else if (props.type === 'array_item') {
        const flattenedArray = items.value.map(item => item.value)

        emit('model-updated', flattenedArray, props.schema.model)
      } else if (props.type === 'metric') {
        emit('model-updated', items.value, props.schema.model)
      }
    }
    const getFieldType = (fieldSchema) => 'field-' + fieldSchema.type

    const updateModel = (val, model, inputType, index) => {
      if (props.type === 'array_item') {
        const flattenedArray = items.value.map(item => item.value)

        emit('model-updated', flattenedArray, props.schema.model)
      } else if (props.type === 'array_card_container') {
        if (!cardContainerModel.value[index]) {
          cardContainerModel.value[index] = {}
        }

        if (inputType === 'number') {
          cardContainerModel.value[index][model] = Number(val)
        } else {
          cardContainerModel.value[index][model] = val
        }

        emit('model-updated', cardContainerModel.value, props.schema.model)
      } else if (props.type === 'metric') {
        const foundField = items.value.find(field => field.name === index)
        if (foundField && foundField[model] !== undefined && inputType === 'number') {
          foundField[model] = Number(val)
        }

        emit('model-updated', items.value, props.schema.model)
      }
    }

    onMounted(() => {
      if (Array.isArray(value.value)) {
        (value.value as Array<any>).forEach((val, idx) => {
          if (props.type === 'array_item') {
            items.value.push({ value: val })
          } else if (props.type === 'array_card_container') {
            let itemsDefaultValue = props.schema.items.schema
            if (props.schema.items && props.schema.items.default) {
              if (isFunction(props.schema.items.default)) {
                itemsDefaultValue = props.schema.items.default()
              } else {
                itemsDefaultValue = props.schema.items.default
              }
            }

            cardContainerModel.value[idx] = val

            items.value.push(itemsDefaultValue)
          }
        })
      }
    })

    return {
      value,
      getFieldID,
      generateSchema,
      newElement,
      removeElement,
      getFieldType,
      updateModel,
      items,
      cardContainerModel
    }
  }
})
</script>

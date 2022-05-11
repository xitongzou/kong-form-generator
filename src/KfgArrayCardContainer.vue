<template>
  <div
    v-if="formModel && formModel.fields"
    class="d-flex"
  >
    <KCard class="mb-2">
      <template slot="body">
        <div
          v-for="(field, idx) in formModel.fields"
          :key="idx"
        >
          <KInput
            v-if="field.inputType === 'text' || field.inputType === 'number'"
            v-model="field.value"
            :type="field.inputType"
            :label="field.label"
            :label-attributes="{
              help: field.help
            }"
            @input="(val) => updateModel(val, field.model, field.inputType)"
          />
        </div>
      </template>
    </KCard>

    <KButton
      class="non-visual-button kfg-array-card-delete"
      @click="$emit('removeItem')"
    >
      <KIcon
        size="16"
        icon="trash"
        color="var(--red-500)"
      />
    </KButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'KfgArrayCardContainer',

  props: {
    model: {
      type: Object,
      default: null
    },
    schema: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0,
      required: true
    },
    prepopulatedValue: {
      type: Array,
      default: null
    }
  },
  setup (props, { emit }) {
    const formModel = ref({ ...JSON.parse(JSON.stringify(props.model)) })

    formModel.value.fields.forEach(field => {
      field.value = props.prepopulatedValue && props.prepopulatedValue[props.index] ? props.prepopulatedValue[props.index][field.model] : null
    })

    const updateModel = (val, model, inputType) => {
      emit('model-updated', val, model, inputType, props.index)
    }

    return {
      formModel,
      updateModel
    }
  }
})
</script>

<style lang="scss">
.kong-form-generator {
  .array-card-container-wrapper {
    width: 100%;

    .kong-card {
      width: 100%;

      .k-card-body div {
        .k-input-wrapper {
          margin-bottom: var(--spacing-sm);
        }

        &:last-child {
          .k-input-wrapper {
            margin-bottom: 0;
          }
        }
      }
    }

    .kfg-array-card-delete {
      height: fit-content;
    }
  }
}
</style>

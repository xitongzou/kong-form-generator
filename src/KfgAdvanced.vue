<template>
  <div
    v-if="schema"
    class="advanced-field-dropdown-wrapper"
    data-testid="advanced-field-dropdown-wrapper"
  >
    <div
      class="advanced-field-title"
      @click="handleOpen"
    >
      <i class="material-icons">{{ isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_right' }}</i>
      <span>{{ titleText }}</span>
    </div>
    <div
      :class="openClass"
      class="advanced-field-dropdown"
    >
      <KongFormGenerator
        :schema="schema"
        :model="model"
        @model-updated="updateModel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'KfgAdvanced',
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
    }
  },
  setup (props, { root }) {
    const isOpen = ref(false)
    const openClass = computed(() => isOpen.value ? 'open' : 'closed')
    const fieldCount = computed(() => props.schema.fields?.length)
    const titleText = computed(() => `${isOpen.value ? 'Hide' : 'View'} ${fieldCount.value} Advanced Fields`)
    const handleOpen = () => { isOpen.value = !isOpen.value }
    const updateModel = (model, schema) => root.$emit('model-updated', model, schema)

    return {
      isOpen,
      openClass,
      fieldCount,
      titleText,
      handleOpen,
      updateModel
    }
  }
})
</script>

<style lang="scss" scoped>
.field-advanced {
  margin-top: -1rem;
  margin-bottom: 2rem !important;
}
.advanced-field-dropdown-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  .advanced-field-title {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    color: var(--blue-500);
    cursor: pointer;
    order: 2;
    i {
      font-size: 1rem;
    }
    &:hover span {
      text-decoration: underline;
    }
  }
  .advanced-field-dropdown {
    position: relative;
    display: block;
    width: 100%;
    max-height: 100%;
    height: auto;
    overflow: hidden;
    transition: max-height 300ms cubic-bezier(.785, .135, .15, .86);
    &.closed {
      max-height: 0;
    }
  }
}
</style>

<template>
  <div class="w-100">
    <KongFormGenerator
      :model="model"
      :schema="schema"
    />
    <KButton
      appearance="danger"
      class="delete non-visual-button"
      type="input"
      @click="$emit('removeItem')"
    >
      - Remove Field
    </KButton>
    <hr>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'KfgArrayMultiItem',
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
  }
})
</script>

<style lang="scss" scoped>
.label-hint {
  font-weight: 300;
  text-align: center;
  padding: 0.5rem;
}
</style>

<template>
  <div class="d-flex w-100 kfg-array-item">
    <slot />
    <KButton
      class="delete non-visual-button mt-auto mb-auto"
      type="button"
      @click="$emit('removeItem')"
    >
      <KIcon
        slot="icon"
        size="16"
        icon="trash"
        color="var(--red-500)"
      />
    </KButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'KfgArrayItem',
  props: {
    model: {
      type: String,
      default: null
    }
  }
})
</script>

<style lang="scss">
.formfield-array-item {
  .kfg-array-item {
    .k-input-wrapper.k-input {
      width: 75%;
      box-shadow: none !important;
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>

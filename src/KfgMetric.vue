<template>
  <div
    :class="{ active: contentVisible }"
    class="field-dropdown"
  >
    <div
      class="title"
      @click="contentVisible = !contentVisible"
    >
      {{ model && model.name ? model.name : 'New Metric' }}
      <KButton class="ml-auto mb-3 non-visual-button">
        <KIcon
          title="Toggle"
          size="20"
          color="var(--blue-500)"
          icon="chevronDown"
        />
      </KButton>
    </div>
    <transition name="slide-fade">
      <div
        v-if="contentVisible"
        class="content"
      >
        <KongFormGenerator
          :schema="schema"
          :model="model"
          @input-updated="updateInput"
        />
        <KButton
          class="float-right mb-2 non-visual-button"
          @click="$emit('removeItem')"
        >
          <KIcon
            icon="trash"
            color="var(--red-500)"
          />
        </KButton>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'KfgMetric',
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    schema: {
      type: Object,
      default: () => {}
    }
  },
  setup (props, { emit }) {
    const contentVisible = ref(false)
    const updateInput = (value, model, inputType) => {
      emit('model-updated', value, model, inputType, props.model.name)
    }

    return {
      updateInput,
      contentVisible
    }
  }
})
</script>

<style lang="scss" scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .5s;
  padding: 0;
}
.slide-fade-enter,
.slide-fade-leave-to {
  max-height: 0 !important;
}

.metrics-wrapper {
  width: 100%;
  .btn,
  .metrics-wrapper i {
    cursor: pointer;
  }
}

.field-dropdown {
  .title {
    display: flex;
    position: relative;
    align-items:center;
    width: 100%;
    height: 45px;
    padding: 0 1rem 0 5px;
    background-color: var(--grey-100);
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: transform .2s cubic-bezier(0.41,0.35,1,0.28) 0s, background-color .2s ease-in;
    &:hover { background-color: #f5f5f5; }
  }
  i {
    margin-left: auto;
    user-select: none;
    transition: all .7s;
  }
  .content {
    height: auto;
    border: 1px solid #eee;
    border-top: 0;
    overflow: hidden;
    transition: all .5s;
    i:hover { color: #c9302c; }
    .kong-form-generator { padding: 1rem; }
  }
  &.active .title .kong-icon { transform: rotate(180deg); }
}
</style>

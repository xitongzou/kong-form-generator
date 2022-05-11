<template>
  <div class="field-wrap w-100">
    <vue-autosuggest
      id="vue-autosuggest"
      ref="suggestion"
      v-model.trim="searchText"
      :class="{bypassSearch : 'no-search'}"
      :suggestions="filteredOptions"
      :input-props="inputProps"
      :get-suggestion-value="getSuggestionValue"
      :should-render-suggestions="(size, loading) => size >= 0 && !loading && !bypassSearch"
      :style="{ zIndex: zIndex }"
      @keydown.enter.stop
      @keydown.down="buildSuggestionList"
      @click="buildSuggestionList"
      @selected="onSelected"
      @input="(text) => updateModel(text)"
    >
      <template #after-suggestions>
        <div
          v-if="filteredOptions[0].data.length === 0 && message"
          class="autosuggest__results_message"
        >
          <KIcon
            v-if="message === 'loading'"
            icon="spinner"
            size="16"
            color="var(--black-70)"
          />
          <span v-else>{{ message }}</span>
        </div>
      </template>

      <template #default="{suggestion}">
        <div class="w-100">
          <div
            :data-testid="suggestion.item.id && `${suggestion.item.id}-0`"
            class="w-100 first-part"
          >
            {{ getSuggestionValue(suggestion).split(' - ')[0] }}
          </div>
          <div
            v-for="(field, idx) in getSuggestionValue(suggestion).split(' - ').slice(1)"
            :key="idx"
            :data-testid="(suggestion.item.id && `${suggestion.item.id}-${idx + 1}`) || idx + 1"
            class="d-flex justify-content-between"
          >
            {{ field }}
          </div>
        </div>
      </template>
    </vue-autosuggest>
  </div>
</template>

<script lang="ts">
import { VueAutosuggest } from 'vue-autosuggest'
import { computed, nextTick, defineComponent, onMounted, ref } from '@vue/composition-api/dist/vue-composition-api'
import abstractFields from './abstractFields'
import { AxiosResponse } from 'axios'
// import { EntityServices } from '@KHCP/pages/Configuration/services/endpoints'

const requestResultsLimit = 190
const fieldStates = {
  CREATE_NOT_FROM_ENTITY: 'CREATE_NOT_FROM_ENTITY',
  CREATE_FROM_ENTITY: 'CREATE_FROM_ENTITY',
  UPDATE_ENTITY: 'UPDATE_ENTITY',
  SET_REFERRAL_VALUE: 'SET_REFERRAL_VALUE'
}

export default defineComponent({
  name: 'KfgAutoSuggest',
  components: { VueAutosuggest },

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
    },
    entityId: {
      type: String,
      default () {
        return ''
      }
    },
    prepopulatedData: {
      type: String,
      default () {
        return ''
      }
    }
  },

  setup (props, { root: { $route, $set, $store }, parent, emit }) {
    const inputProps = {
      id: props.schema.model,
      class: 'form-control w-100',
      placeholder: props.schema.placeholder
    }
    const suggestions = ref([])
    const searchText = ref('')

    const message = ref('loading')

    const controlPlaneId = computed((): string => {
      return $route.params.control_plane_id || $store.state.runtimegroups?.runtimeGroup?.id
    })

    const filteredOptions = computed(() => [
      {
        data: suggestions.value.filter(item => {
          const suggestionText = getSuggestionValue({ item }).toLowerCase()

          return suggestionText.indexOf(searchText.value ? searchText.value.toLowerCase() : '') > -1
        })
      }
    ])

    const getFieldState = (model, referralEntity, bypassSearch) => {
      if (bypassSearch) {
        return fieldStates.SET_REFERRAL_VALUE
      } else if (model && !referralEntity || !model && referralEntity) {
        return fieldStates.UPDATE_ENTITY
      } else if (model && referralEntity) {
        return fieldStates.CREATE_FROM_ENTITY
      }

      return fieldStates.CREATE_NOT_FROM_ENTITY
    }

    const entity = computed(() => props.schema.entity)

    const referralEntity = computed(() => $route && $route.params[entity.value])

    const bypassSearch = computed(() => $route && $route.query && $route.query.no_search)

    const fieldState = computed(() => getFieldState(props.model[props.schema.model], referralEntity || props.entityId, bypassSearch))

    const zIndex = computed(() => {
      const fields = (parent && parent.$parent && parent.$parent.schema && parent.$parent.schema.fields) || []

      return fields.length ? (fields.length - fields.findIndex(f => f.model === props.schema.model)) : 100
    })

    const { value } = abstractFields({
      formOptions: props.formOptions,
      schema: props.schema,
      model: props.model,
      $set,
      emit
    })

    onMounted(async () => {
      await nextTick()

      switch (fieldState.value) {
        case fieldStates.UPDATE_ENTITY:
          fetchCurrentReferralByModel(entity.value, props.model[props.schema.model])
          break
        case fieldStates.CREATE_FROM_ENTITY:
          searchText.value = getSuggestionValue({ item: referralEntity.value })
          break
        case fieldStates.SET_REFERRAL_VALUE:
          searchText.value = ''
      }

      if (props.prepopulatedData) {
        searchText.value = props.prepopulatedData
      }
    })

    const getItem = (data) => {
      if (data.data) {
        return data.data.length > 0 ? data.data[0] : []
      }

      return data
    }

    const fetchCurrentReferralByModel = (entity, id): void => {
      const handleResponse = (res) => {
        searchText.value = getSuggestionValue({ item: getItem(res.data) })
      }

      /*

      const entityServices = new EntityServices(controlPlaneId.value)

      entityServices.getOne(entity, id)
        .then(res => handleResponse(res))

        */
    }

    const fetchEntity = async (offset, data) => {
      const size = 1000
      const handleResponse = (res: AxiosResponse, data = []) => {
        data.push(...res.data.data)
        if (data.length >= requestResultsLimit || !res.data.offset) return data

        return handleResponse(res.data.offset, data)
      }

      return []

      /*

      const entityServices = new EntityServices(controlPlaneId.value)

      return entityServices.getAll(entity.value, size)
        .then(res => handleResponse(res))

      */
    }

    const buildSuggestionList = async () => {
      await fetchEntity(0, []).then(results => {
        message.value = 'No results'
        suggestions.value = results
      })
        .catch(err => {
          message.value = `There was an error loading ${props.schema.entity}`
          console.error('err!', err)
        })
    }

    const getSuggestionValue = (suggestion) => {
      const fields = props.schema && props.schema.inputValues && props.schema.inputValues.fields

      return (fields && fields.length && suggestion) ? fields.map(field => suggestion.item[field]).filter(Boolean).join(' - ') : ''
    }

    const updateModel = (value) => emit('model-updated', value && value.length ? value : null, props.schema.model)

    const onSelected = (item) => {
      if (!item) {
        return
      }

      searchText.value = getSuggestionValue(item)
      updateModel(getReturnValue(item))
    }

    const getReturnValue = (item) => {
      item = item.item || {}
      const returnKey = props.schema && props.schema.returnKey

      return returnKey ? item[returnKey] : item.id
    }

    return {
      message,
      searchText,
      inputProps,
      fieldState,
      referralEntity,
      entity,
      bypassSearch,
      zIndex,
      filteredOptions,
      buildSuggestionList,
      getItem,
      getFieldState,
      fetchCurrentReferralByModel,
      getSuggestionValue,
      updateModel,
      onSelected,
      getReturnValue
    }
  }
})
</script>

<style lang="scss">
#vue-autosuggest {
  position: relative;
  width: 100%;
  &:before {
    position: absolute;
    top: 6px;
    right: .5rem;
    width: 1rem;
    height: 1rem;
    color: rgba(0,0,0,.25);
    content: ' \25BE';
  }
  input {
    cursor: pointer;
  }
  &.bypassSearch {
    &:before {
      content: ''
    }
    input {
      cursor: initial;
    }
  }
  .autosuggest__results {
    position: absolute;
    width: 100%;
    max-height: 240px;
    margin-top: -1px;
    box-shadow: 0 2px 9px rgba(0,0,0,.15);
    font-size: 14px;
    border-top: 0;
    border: 1px solid rgba(0,0,0,.1);
    border-radius: 0 0 .1875rem .1875rem;
    background: white;
    overflow: auto;
    div {
      position: relative;
      opacity: .7;
      &:first-child {
        opacity: 1;
        font-weight: 500;
      }
    }
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      li {
        display: flex;
        padding: .5rem 1rem;
        font-size: 14px;
        cursor: pointer;
        transition: all 200ms ease;
        &:hover,
        &.autosuggest__results-item--highlighted {
          background: var(--grey-100);
        }
      }

      .first-part {
        text-overflow: ellipsis;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    &_message {
      padding: .5rem 0;
      text-align: center;
      font-size: 14px;
      color: rgba(0,0,0,.7);
    }
  }
}
</style>

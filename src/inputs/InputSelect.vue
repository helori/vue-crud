<style scoped>
    
</style>

<template>
  <div>
    <select
        :id="name"
        class="form-control"
        v-model="dataValue"

        @input=""
        @change="updateValue($event.target.value)"
        @keyup.enter="updateValue($event.target.value)"
        @focus="hasFocus = true"
        @blur="hasFocus = false">
            <option v-if="hasEmpty" :value="emptyValue">{{ emptyLabel }}</option>

            <option v-if="!hasGroups" v-for="option in options" :value="option[optionValueKey]">{{ option[optionLabelKey] }}</option>

            <optgroup v-if="hasGroups" v-for="group in options" :label="group[groupLabelKey]">
              <option v-for="option in group[groupItemsKey]" :value="option[optionValueKey]">{{ option[optionLabelKey] }}</option>
            </optgroup>
    </select>
  </div>
</template>

<script>
    import inputMixin from '../mixins/InputMixin.js'
    export default {
        mixins: [inputMixin],
        props: {
            options: { 
              type: Array,
              default: function(){
                return [];
              }
            },
            optionLabelKey: {
                type: String,
                default: 'label'
            },
            optionValueKey: {
                type: String,
                default: 'value'
            },
            groupLabelKey: {
              type: String,
              default: '',
              required: false
            },
            groupItemsKey: {
              type: String,
              default: '',
              required: false
            },
            hasEmpty: {
              type: Boolean,
              default: true
            },
            emptyValue: {
              type: String,
              default: null
            },
            emptyLabel: {
              type: String,
              default: ''
            }
        },
        computed: {
          hasGroups(){
            return this.groupLabelKey !== '' && this.groupItemsKey !== '';
          }
        }
    }
</script>

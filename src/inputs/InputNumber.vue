<style scoped>
    
</style>

<template>
    <input
        type="number"
        :id="name"
        :min="min"
        :max="max"
        :step="step"
        :class="'form-control text-' + textAlign + (classes ? ' ' + classes : '')"
        :placeholder="placeholder"
        v-model="dataValue"
        :disabled="disabled"

        @input="updateValueLive($event.target.valueAsNumber)"
        @change="updateValue($event.target.valueAsNumber)"
        @keyup.enter="updateValue($event.target.valueAsNumber)"
        @focus="hasFocus = true"
        @blur="hasFocus = false" />
</template>

<script>
    import inputMixin from '../mixins/InputMixin.js'
    export default {
        mixins: [inputMixin],
        props: {
            min: { 
              type: Number,
              default: 0
            },
            max: { 
              type: Number,
              default: 100000000
            },
            step: { 
              type: Number,
              default: 1
            }
        },
        methods: {
            validateValue(value) {
                return !isNaN(value);
            }
        }
    }
</script>

<style scoped>
    
</style>

<template>
    <input
        type="url"
        :id="name"
        class="form-control"
        :placeholder="placeholder"
        v-model="dataValue"
        :class="'text-' + textAlign"
        :disabled="disabled"
        
        @input="updateValueLive($event.target.value)"
        @change="updateValue($event.target.value)"
        @keyup.enter="updateValue($event.target.value)"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
        />
</template>

<script>
    import inputMixin from '../mixins/InputMixin.js'
    export default {
        mixins: [inputMixin],
        data(){
            return{
                debounceDelay: 500
            };
        },
    }
</script>


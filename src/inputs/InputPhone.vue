<style scoped>
    
</style>

<template>
    <input
        type="tel"
        :id="name"
        class="form-control"
        :placeholder="placeholder"
        pattern=".{10}"
        v-model="dataValue"
        :class="'text-' + textAlign"
        
        @input=""
        @change="updateValue($event.target.value)"
        @keyup.enter="updateValue($event.target.value)"
        @focus="hasFocus = true"
        @blur="hasFocus = false" />
</template>

<script>
    import inputMixin from '../mixins/InputMixin.js'
    export default {
        mixins: [inputMixin]
    }
</script>

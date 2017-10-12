<style scoped>
    textarea{
        resize: vertical;
    }
</style>

<template>
    
    <textarea
        :id="name"
        class="form-control"
        :placeholder="placeholder"
        v-model="dataValue"
        :class="'text-' + textAlign"
        :style="'min-height:' + minHeight + 'px'"
        
        @input=""
        @change="updateValue($event.target.value)"
        @keyup.enter="updateValue($event.target.value)"
        @focus="hasFocus = true"
        @blur="hasFocus = false"></textarea>

</template>

<script>
    import inputMixin from '../mixins/InputMixin.js'
    export default {
        mixins: [inputMixin],

        props: {
            minHeight: {
                type: Number,
                required: false,
                default: 150
            }
        }
    }
</script>

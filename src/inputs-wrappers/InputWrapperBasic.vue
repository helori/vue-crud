<style scoped>
.form-group{
    margin-bottom: 5px;
}
label{
    display: block;
}
</style>

<template>
    
    <div class="form-group" :class="{'has-error': error}">
        <label :for="name" v-if="label !== null" v-html="label" :style="'text-align: ' + labelAlign"></label>
        <div :class="{'input-group': suffix !== null}">
            <slot name="input"></slot>
            <div class="input-group-addon" v-if="suffix !== null">{{ suffix }}</div>
        </div>
        <p class="help-block" v-if="help">{{ help }}</p>
        <p class="help-block" v-if="error">{{ error }}</p>
    </div>

</template>

<script>
    export default {
        props: {
            label: {
                type: String,
                default: null,
                required: false
            },
            labelAlign: {
                type: String,
                default: 'text-left',
                required: false
            },
            name: {
                type: String,
                default: ''
            },
            error: {
                default: null
            },
            help: {
                type: String,
                default: null,
                required: false
            },
            suffix: {
                type: String,
                default: null,
                required: false  
            }
        },
    }
</script>

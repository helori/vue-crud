<style scoped>
    .form-group{
        margin-bottom: 5px;
    }
    label{
        display: block;
    }
    label.big{
        font-size: 18px;
        font-weight: 500;
    }
</style>

<template>
    
    <div class="form-group" :class="{'has-error': error}">
        <label :for="name" v-if="label !== null" v-html="label" :class="labelClass + ' ' + labelType"></label>
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
            labelClass: {
                type: String,
                default: 'text-left',
                required: false
            },
            labelType: {
                type: String,
                default: 'normal',
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

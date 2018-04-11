<style scoped>

</style>

<template>
    
    <div class="form-group" :class="'mb-' + margin + (layout === 'horizontal' ? ' row align-items-center' : '') + (classes ? ' ' + classes : '')">
        
        <label :for="name" 
            v-if="label !== null" 
            v-html="label" 
            :style="'text-align: ' + labelAlign" 
            :class="(layout === 'horizontal' ? 'col-form-label col-sm-' + labelColumns : '')">
        </label>

        <div :class="(layout === 'horizontal') ? 'col-sm-' + (12 - labelColumns) : ''">
            <div class="input-group" v-if="suffix !== null">
                <slot name="input"></slot>
                <div class="input-group-append" v-if="suffix !== null">
                    <span class="input-group-text">{{ suffix }}</span>
                </div>
            </div>
            <slot name="input" v-else></slot>
        </div>

        <p class="text-danger" v-if="error">{{ error }}</p>

    </div>

</template>

<script>
    export default {
        props: {
            layout: {
                type: String,
                default: 'basic',
                required: false
            },
            label: {
                type: String,
                default: null,
                required: false
            },
            labelColumns: {
                type: Number,
                default: 4,
                required: false
            },
            labelAlign: {
                type: String,
                default: 'text-left',
                required: false
            },
            margin: {
                type: Number,
                default: 2,
                required: false
            },
            name: {
                type: String,
                default: '',
                required: false
            },
            error: {
                default: null
            },
            suffix: {
                type: String,
                default: null,
                required: false  
            },
            classes: {
                type: String,
                default: null,
                required: false
            },
        },
    }
</script>

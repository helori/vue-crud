<style scoped>
.form-horizontal{
    margin: 0 auto;
}
.form-group{
    margin-bottom: 5px;
}
</style>

<template>
    
    <div class="form-horizontal" :style="'width:' + width">
        <div class="form-group" :class="{'has-error': error}">
            <label :for="name" :class="'control-label col col-sm-' + labelColumns" :style="'text-align: ' + labelAlign" v-if="!inverted">{{ label }}</label>
            <div :class="'col col-sm-' + (12 - labelColumns)">
                <div class="input-group" v-if="suffix !== null">
                    <slot name="input"></slot>
                    <div class="input-group-addon" v-if="suffix !== null">{{ suffix }}</div>
                </div>
                <slot name="input" v-else></slot>
                <p class="help-block" v-if="help">{{ help }}</p>
                <p class="help-block" v-if="error">{{ error }}</p>
            </div>
            <label :for="name" :class="'control-label col col-sm-' + labelColumns" :style="'text-align: ' + labelAlign" v-if="inverted">{{ label }}</label>
        </div>
    </div>

</template>

<script>
    export default {
        props: {
            label: {
                type: String,
                default: ''
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
            inverted: {
                type: Boolean,
                default: false,
                required: false
            },
            labelColumns: {
                type: Number,
                default: 4,
                required: false
            },
            labelAlign: {
                type: String,
                default: 'right',
                required: false
            },
            suffix: {
                type: String,
                default: null,
                required: false  
            },
            width: {
                type: String,
                required: false,
                default: '100%'
            }
        },
    }
</script>

<style scoped>
.panel{
    margin: 0;
}
</style>

<template>
    <div class="panel panel-default" :style="'margin-top:' + marginTop + 'px;' + 'margin-bottom:' + marginBottom + 'px;'">
        <div class="panel-heading" v-if="hasSlot('title')">
            <h4 class="panel-title">
                <slot name="title"></slot>
            </h4>
        </div>
        <div class="panel-body" :style="'padding: ' + padding + 'px'" v-if="hasSlot('body')">
            <slot name="body"></slot>
        </div>

        <slot name="table" v-if="hasSlot('table')"></slot>
    </div>
</template>

<script>
    export default {
        methods: {
            hasSlot(slot){
                return this.$slots[slot] ? true : false;
            }
        },
        props: {
            padding: {
                type: Number,
                default: 15,
                required: false
            },
            marginTop: {
                type: Number,
                default: 0,
                required: false
            },
            marginBottom: {
                type: Number,
                default: 30,
                required: false
            }
        }
    }
</script>

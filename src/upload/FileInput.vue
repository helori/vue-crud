<style scoped lang="scss">

input.file-input{
    position: absolute;
    left: -9999px;
}
label{
    margin: 0;
}
</style>

<template>
    <span class="document-input">

        <input type="file" 
            :multiple="multiple"
            :id="'file-input-' + id"
            class="file-input">

        <label :for="'file-input-' + id" 
            class="filedrop m-0"
            :class="classes">
            <slot name="content"></slot>
        </label>

    </span>

</template>

<script>

    import FileInputMixin from './FileInputMixin.js'
    
    export default {

        mixins: [
            FileInputMixin
        ],
        
    }
</script>

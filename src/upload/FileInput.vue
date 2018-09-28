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
    <div class="document-input" :class="classes">

        <input type="file" 
            :multiple="multiple"
            :id="'file-input-' + id"
            class="file-input">

        <label :for="'file-input-' + id" class="filedrop m-0">
            <span v-show="showIcon">
                <i class="fas fa-folder-open"></i>
            </span>
            {{ inputText }}
        </label>

    </div>

</template>

<script>

    import DocumentInputMixin from './DocumentInputMixin.js'
    
    export default {

        mixins: [
            DocumentInputMixin
        ],
        
    }
</script>

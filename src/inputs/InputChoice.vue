<style scoped lang="scss">
.choice-wrapper{
    margin: -5px auto 0 auto;
}
.btn{
    margin-top: 5px;
    white-space: normal;
}
.col-sm-2-4{
    width: 20%;
}
</style>

<template>
    
    <div class="choice-wrapper" :style="'width:' + width + '%'">
        <div class="form-row">
            <div v-for="option in options" :key="option[optionValueKey]" :class="columnClass">
                <button 
                    type="button"
                    class="btn btn-block"
                    :class="{
                        'btn-primary': hasOption(option[optionValueKey]), 
                        'btn-outline-primary': !hasOption(option[optionValueKey])
                    }"
                    @click="setOption(option[optionValueKey])">
                    {{ option[optionLabelKey] }}
                </button>
            </div>
        </div>
                
    </div>

</template>

<script>
    import inputMixin from '../mixins/InputMixin.js'
    export default {
        mixins: [inputMixin],
        props: {
            options: {
                type: Array,
                required: true,
                default: function(){
                    return [];
                }
            },
            optionLabelKey: {
                type: String,
                default: 'label'
            },
            optionValueKey: {
                type: String,
                default: 'value'
            },
            multiple: {
                type: Boolean,
                default: false,
                required: false
            },
            width: {
                type: Number,
                default: 100,
                required: false
            },
            columnClass: {
                type: String,
                default: 'col'
            },
        },
        methods: {
            setOption(opt){
                if(this.multiple){
                    var idx = this.dataValue.indexOf(opt);
                    if(idx !== -1){
                        this.dataValue.splice(idx, 1);
                    }else{
                        this.dataValue.push(opt);
                    }
                }else{
                    this.dataValue = opt;
                }
                this.updateValue(this.dataValue);
            },

            hasOption(opt){
                if(this.multiple){
                    if(this.dataValue !== null){
                        var idx = this.dataValue.indexOf(opt);
                        return (idx !== -1);    
                    }else{
                        return false;
                    }
                }else{
                    return (this.dataValue === opt);
                }
            }
        }
    }
</script>


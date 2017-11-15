<style scoped lang="scss">
.choice-wrapper{
    margin: 0 auto;
}
.btn{
    margin-bottom: 5px;
    white-space: normal;
}
</style>

<template>
    
    <div class="choice-wrapper" :style="'width:' + width + '%'">
        <div class="row narrow">
            <div v-for="option in options" :key="option[optionValueKey]" class="col" :class="{
                'col-sm-12': columns === 1, 
                'col-sm-6': columns === 2, 
                'col-sm-4': columns === 3, 
                'col-sm-3': columns === 4
            }">
                <button 
                    type="button"
                    class="btn btn-block"
                    :class="{
                        'btn-primary': hasOption(option[optionValueKey]), 
                        'btn-default': !hasOption(option[optionValueKey])
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
            columns: {
                type: Number,
                default: 2,
                required: false
            },
            width: {
                type: Number,
                default: 100,
                required: false
            }
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


<style scoped>
.row{
    margin-left: -2.5px;
    margin-right: -2.5px;
    margin-bottom: 5px;
}
.col{
    padding-left: 2.5px;
    padding-right: 2.5px;
}
.lab{
    padding-top: 7px;
    text-align: center;
    font-weight: bold;
}
</style>

<template>
    
    <div>
        <div class="row">
            <div class="col col-sm-10">
                <div class="row">
                    <div class="col" :class="'col-sm-' + (12 / options.length)" v-for="option in options">
                        <div class="lab">{{ option.label }}</div>
                    </div>
                </div>
            </div>
            <div class="col col-sm-2">
                <button type="button" class="btn btn-primary btn-block" @click="insert()">
                    <i class="fal fa-plus-circle"></i>
                </button>
            </div>
        </div>
        <div class="row" v-for="(data, idx) in dataValue">
            <div class="col col-sm-10">
                <div class="row">
                    <div class="col" :class="'col-sm-' + (12 / options.length)" v-for="option in options">
                        <input-text
                            v-if="option.options === null"
                            v-model="data[option.key]"
                            :name="option.key + idx"
                            @input="update">
                        </input-text>
                        <input-select
                            v-if="option.options !== null"
                            v-model="data[option.key]"
                            :name="option.key + idx"
                            :options="option.options"
                            :has-empty="false"
                            @input="update">
                        </input-select>
                    </div>
                </div>
            </div>
            <div class="col col-sm-2">
                <button type="button" class="btn btn-danger btn-block" @click="removeAt(idx)">
                    <i class="fal fa-trash"></i>
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
                required: true
            }
        },
        methods: {
            update(){
                this.updateValue(this.dataValue);
            },

            removeAt(idx){
                this.dataValue.splice(idx, 1);
                this.updateValue(this.dataValue);
            },

            insert(){
                var elt = {};

                for(var i=0; i<this.options.length; ++i){
                    elt[this.options[i].key] = '';
                }

                this.dataValue.push(elt);
                this.updateValue(this.dataValue);
            }
        }
    }
</script>


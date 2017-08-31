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
                    <div class="col" :class="'col-sm-' + (12 / labels.length)" v-for="label in labels">
                        <div class="lab">{{ label }}</div>
                    </div>
                </div>
            </div>
            <div class="col col-sm-2">
                <button type="button" class="btn btn-default btn-block" @click="insert()">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
        </div>
        <div class="row" v-for="(data, idx) in dataValue">
            <div class="col col-sm-10">
                <div class="row">
                    <div class="col" :class="'col-sm-' + (12 / keys.length)" v-for="key in keys">
                        <input-text
                            v-model="data[key]"
                            :name="key + idx"
                            @input="update">
                        </input-text>
                    </div>
                </div>
            </div>
            <div class="col col-sm-2">
                <button type="button" class="btn btn-danger btn-block" @click="removeAt(idx)">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
    </div>

</template>

<script>
    import inputMixin from '../crud/InputMixin.js'
    export default {
        mixins: [inputMixin],
        props: {
            labels: {
                type: Array,
                required: true
            },
            keys: {
                type: Array,
                required: true
            },
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

                elt[this.keys[0]] = '';
                elt[this.keys[1]] = '';

                this.dataValue.push(elt);
                this.updateValue(this.dataValue);
            }
        }
    }
</script>


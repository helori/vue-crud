<style lang="scss" scoped>

</style>

<template>
    <div>

        <button type="button"
            class="btn btn-secondary dropdown-toggle" 
            :id="uniqId" 
            data-toggle="dropdown" 
            aria-haspopup="true" 
            aria-expanded="false">
            <i class="fal fa-plus-circle"></i>
            {{ buttonText }}
        </button>

        <div class="dropdown-menu bg-gray-200 p-0"
            :aria-labelledby="uniqId">
            
            <div class="p-3">

                <input type="text"
                    class="form-control mb-2"
                    placeholder="Rechercher..."
                    v-model="search">

                <div class="bg-white rounded border border-1 border-gray-300 font-size-200" 
                    style="max-height: 200px; overflow-y: scroll;">
                    <div v-for="it in filteredItems"
                        :key="it.id"
                        class="py-1 px-3 pointer bg-gray-100-hover"
                        :class="{
                            'text-success-400 bg-success-100': hasItem(it)
                        }"
                        @click="$event.stopPropagation(); toggleItem(it)">
                        <span v-show="hasItem(it)">
                            <i class="fal fa-check-circle fa-fw mr-1"></i>
                        </span>
                        {{ it[itemsNameField] }}
                    </div>
                </div>
                
            </div>
        </div>

        <div v-for="item in dataValue" :key="item.id"
            class="bg-gray-100 rounded border border-1 border-gray-300 py-2 px-3 mt-1">
            <i class="fal fa-check-circle fa-fw mr-1"></i>
            {{ item[itemsNameField] }}
        </div>

    </div>
</template>

<script>

    import inputMixin from '../mixins/InputMixin.js'

    export default {

        mixins: [inputMixin],

        data(){
            return {
                search: '',
            };
        },

        props: {
            items: {
                required: true,
                default(){
                    return [];
                }
            },
            itemsNameField: {
                required: true,
                default: 'name'
            },
            buttonText: {
                type: String,
                required: false,
                default: 'Add...'
            },
        },

        computed: {

            filteredItems(){

                let self = this;

                if(this.items.length > 0){
                    var items = this.items;
                    if(this.search){
                        let text = this.search.toLowerCase();
                        items = _.filter(items, function(item) {
                            return (item[self.itemsNameField] && item[self.itemsNameField].toLowerCase().indexOf(text) !== -1);
                        });
                    }
                    return items;
                }
                return [];
            }
        },

        methods: {
            
            toggleItem(item){

                let found = false;

                for(let i=0; i<this.dataValue.length; ++i){
                    let it = this.dataValue[i];
                    if(it.id === item.id){
                        found = true;
                        this.dataValue.splice(i, 1);
                        break;
                    }
                }

                if(!found){
                    this.dataValue.push(item);
                }

                this.updateValue(this.dataValue);
            },

            hasItem(item){
                let found = false;

                for(let i=0; i<this.dataValue.length; ++i){
                    let it = this.dataValue[i];
                    if(it.id === item.id){
                        found = true;
                        break;
                    }
                }
                return found;
            }
        }
    }

</script>

<style scoped lang="scss">
.form-control{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.overlay{
  display: none;
  position: fixed;
  top: 50px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 999;
}
.panel{
  display: none;
  position: fixed;
  top: 65px;
  bottom: 15px;
  right: 15px;
  left: 15px;
  padding: 15px 30px;
  background: white;
  z-index: 1000;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  overflow-y: scroll;
}
h3{
  margin: 0 0 5px 0;
  font-weight: bold;
  font-size: 16px;
}
.group{
  margin: 0 0 15px 0;
}
.item{
  margin: 0 0 2px 0;
  padding: 2px 5px;
  border-radius: 3px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.05);
}
.item:hover{
  background: rgba(0, 0, 0, 0.1);
}
.item.active{
  background: yellow;
}
</style>

<template>
  <div>

    <div :class="'form-control text-' + textAlign + (classes ? ' ' + classes : '')"
      @click="openPanel">
        {{ displayValue }}
    </div>

    <div class="overlay" @click="closePanel"></div>

    <div class="panel" contenteditable="true">
      
      <div class="row" v-if="hasGroups">
        <div class="col-sm-6 col-md-3" v-for="group in options">
          <div class="group">
            <h3>{{ group[groupLabelKey] }}</h3>
            <div class="item"
              v-for="option in group[groupItemsKey]" 
              @click="setValue(option[optionValueKey])"
              :class="{'active': option[optionValueKey] === dataValue}">
              {{ option[optionLabelKey] }}
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="item"
          v-for="option in options" 
          @click="setValue(option[optionValueKey])"
          :class="{'active': option[optionValueKey] === dataValue}">
          {{ option[optionLabelKey] }}
        </div>
      </div>

    </div>

  </div>
</template>

<script>
    import inputMixin from '../mixins/InputMixin.js'
    export default {

        mixins: [inputMixin],

        data(){
          return {
            panel: null,
            overlay: null,
          }
        },

        props: {
            options: { 
              type: Array,
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
            groupLabelKey: {
              type: String,
              default: '',
              required: false
            },
            groupItemsKey: {
              type: String,
              default: '',
              required: false
            },
        },

        computed: {

          hasGroups(){
            return this.groupLabelKey !== '' && this.groupItemsKey !== '';
          },
          
          displayValue(){
            
            let value = '';
            let vm = this;

            if(vm.hasGroups){
              _.forEach(vm.options, function(group){
                _.forEach(group[vm.groupItemsKey], function(option){
                  if(option[vm.optionValueKey] === vm.dataValue){
                    value = option[vm.optionLabelKey];
                  }
                });
              });
            }
            return value;
          }
        },

        mounted(){

          let vm = this;

          this.panel = $(this.$el).find('.panel');
          this.overlay = $(this.$el).find('.overlay');

          this.panel.on('keyup', function(e){
              console.log('-> select panel keyup', e.originalEvent.key);
              if(e.originalEvent.key === 'Escape'){
                  vm.closePanel();
              }
          });
        },

        methods: {

          setValue(value){
            this.updateValue(value);
            this.closePanel();
          },

          openPanel(){
            this.panel.fadeIn(200);
            this.overlay.fadeIn(200);
            this.panel.focus();
          },

          closePanel(){
            this.panel.fadeOut(200);
            this.overlay.fadeOut(200);
          },
        },
    }
</script>

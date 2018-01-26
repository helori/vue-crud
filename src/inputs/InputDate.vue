<style>
.vdp-datepicker.form-control{
    padding: 3px;
}
.vdp-datepicker.form-control input{
    width: 100%;
    border: 0;
    padding: 0 9px;
    height: 30px;
    line-height: 30px;
}
</style>

<template>

    <datepicker 
        v-model="dataValue"
        format="dd MMMM yyyy"
        :class="'form-control' + (classes ? ' ' + classes + '')"
        :class="'text-' + textAlign"
        :full-month-name="true"
        :monday-first="true"
        language="fr"
        @selected="updateValue">
    </datepicker>

</template>

<script>

    import inputMixin from '../mixins/InputMixin.js'
    import Datepicker from 'vuejs-datepicker'
    import moment from 'moment'

    export default {
        mixins: [inputMixin],
        components: {
            Datepicker
        },
        data(){
            return{
                dataValue: this.value ? new Date(this.value) : this.value,
                debounceDelay: 1000
            };
        },
        watch: {
            value: {
                handler: function (val) {
                    this.dataValue = val ? new Date(val) : val;
                }
            }
        },
        mounted(){
            $(this.$el).find('input').css('text-align', this.textAlign);
        },
        methods: {
            formatUpdateValue(val) {
                var d = moment(val).format('YYYY-MM-DD') + ' 00:00:00';
                return d;
            }
        }
    }
</script>


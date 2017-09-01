<style scoped>
.vdp-datepicker.form-control{
    padding: 3px;
}
.vdp-datepicker.form-control input{
    width: 100%;
    border: 0;
    padding: 0 5px;
    height: 32px;
    line-height: 32px;
}
</style>

<template>

    <datepicker 
        v-model="dataValue"
        format="dd MMMM yyyy"
        class="form-control"
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
        methods: {
            formatUpdateValue(val) {
                var d = moment(val).format('YYYY-MM-DD') + ' 00:00:00';
                return d;
            }

            /*formatDisplayValue(value) {
                var d = value.substring(0, 2);
                var m = value.substring(3, 5);
                var y = value.substring(6, 10);
                var val = d + '/' + m + '/' + y;
                return val;
            },

            formatUpdateValue(value) {
                var d = value.substring(0, 2);
                var m = value.substring(3, 5);
                var y = value.substring(6, 10);
                var val = y + '-' + m + '-' + d + ' 00:00:00';
                return val;
            },

            validateValue(val){
                var value = val.trim();
                var valid = true;
                var d = parseInt(value.substring(0, 2));
                var m = parseInt(value.substring(3, 5));
                var y = parseInt(value.substring(6, 10));
                if(value.length !== 10){
                    valid = false;
                }
                else if(isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 31 || m < 1 || m > 12){
                    valid = false;
                }
                return valid;
            }*/
        }
    }
</script>


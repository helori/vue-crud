<style scoped>
    
</style>

<template>
    
    <!--input 
        ref="input"
        type="text"
        :id="name"
        class="form-control"
        v-model="dataValue"
        placeholder="JJ/MM/AAAA"
        pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))"

        @input=""
        @change="updateValue($event.target.value)"
        @keyup.enter="updateValue($event.target.value)"
        @focus="hasFocus = true"
        @blur="hasFocus = false"/-->

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
    import inputMixin from '../crud/InputMixin.js'
    import Datepicker from 'vuejs-datepicker'
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


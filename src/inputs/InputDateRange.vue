<style scoped lang="scss">
.date-range-wrapper{
    //display: inline-block;
    min-width: 260px;
    .form-control{
        width: 100%;
        text-align: center;
    }
}
</style>

<template>

    <div class="date-range-wrapper">
        <input class="date-range form-control">
    </div>
    
</template>

<script>

    import inputMixin from '../mixins/InputMixin.js'
    import DateRangePicker from 'daterangepicker'
    import moment from 'moment'

    export default {

        mixins: [inputMixin],

        components: {
            DateRangePicker
        },

        data(){
            return{
                dataValue: {
                    start: this.value && this.value.start ? moment(this.value.start) : moment(),
                    end: this.value && this.value.end ? moment(this.value.end) : moment(),
                },
                pickerElt: null
            };
        },

        props: {
            ranges: {
                type: Object,
                required: false,
                default(){
                    return {};
                }
            },
            locale: {
                type: Object,
                required: false,
                default(){
                    return {};
                }
            }
        },

        watch: {
            value: {
                handler: function (val) {
                    this.dataValue = {
                        start: val && val.start ? moment(val.start) : moment(),
                        end: val && val.end ? moment(val.end) : moment(),
                    };
                }
            },
            ranges: {
                handler(){

                }
            }
        },

        mounted(){

            var self = this;

            self.$nextTick(function () {

                var options = {
                    startDate: self.dataValue.start,
                    endDate: self.dataValue.end,
                    minDate: moment('20150101'),
                    alwaysShowCalendars: false,
                    showDropdowns: true,
                    autoApply: true,
                    ranges: this.ranges,
                    locale: this.locale
                };

                self.pickerElt = $(self.$el).find('.date-range');

                self.pickerElt.daterangepicker(options).on('apply.daterangepicker', function (e, picker) {

                    self.updateValue({
                        start: picker.startDate,
                        end: picker.endDate,
                    });

                });
            });
        },
        
        methods: {
            formatUpdateValue(val) {
                var d = {
                    start: moment(val.start).format('YYYY-MM-DD') + ' 00:00:00',
                    end: moment(val.end).format('YYYY-MM-DD') + ' 00:00:00'
                }
                return d;
            }
        }
    }
</script>


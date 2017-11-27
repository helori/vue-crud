<style scoped lang="scss">
.date-range-wrapper{
    display: inline-block;
    width: 260px;
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
                }
            };
        },

        watch: {
            value: {
                handler: function (val) {
                    this.dataValue = {
                        start: val && val.start ? moment(val.start) : moment(),
                        end: val && val.end ? moment(val.end) : moment(),
                    };
                }
            }
        },

        mounted(){

            var self = this;

            self.$nextTick(function () {

                var ranges = {
                    '7 derniers jours': [
                        moment().subtract(6, 'days'),
                        moment()
                    ],
                    '30 derniers jours': [
                        moment().subtract(30, 'days'),
                        moment()
                    ],
                    'Ce mois-ci': [
                        moment().startOf('month'),
                        moment().endOf('month')
                    ],
                    'Le mois dernier': [
                        moment().subtract(1, 'month').startOf('month'),
                        moment().subtract(1, 'month').endOf('month')
                    ]
                };

                for(var year = moment().year(); year >= 2015; --year){
                    ranges['Exercice ' + year] = [
                        moment(year + '0101'),
                        moment(year + '1231'),
                    ];
                }

                var locale = {
                    "format": "DD/MM/YYYY",
                    "separator": " au ",
                    "applyLabel": "Appliquer",
                    "cancelLabel": "Annuler",
                    "fromLabel": "Du",
                    "toLabel": "Au",
                    "customRangeLabel": "Personnalisé...",
                    "weekLabel": "W",
                    "daysOfWeek": [
                        "Dim",
                        "Lun",
                        "Mar",
                        "Mer",
                        "Jeu",
                        "Ven",
                        "Sam"
                    ],
                    "monthNames": [
                        "Janvier",
                        "Février",
                        "Mars",
                        "Avril",
                        "Mai",
                        "Juin",
                        "Juillet",
                        "Août",
                        "Septembre",
                        "Octobre",
                        "Novembre",
                        "Décembre"
                    ],
                    "firstDay": 1
                };

                var options = {
                    startDate: self.dataValue.start,
                    endDate: self.dataValue.end,
                    minDate: moment('20150101'),
                    alwaysShowCalendars: false,
                    showDropdowns: true,
                    autoApply: true,
                    ranges: ranges,
                    locale: locale
                };

                $(self.$el).find('.date-range').daterangepicker(options).on('apply.daterangepicker', function (e, picker) {

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


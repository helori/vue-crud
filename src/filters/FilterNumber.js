import Vue from 'vue'
import numeral from 'numeral'

numeral.register('locale', 'fr', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal : function (number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: '€'
    }
});

// switch between locales
numeral.locale('fr');


Vue.filter('number', function (value, decimals) {
    var format = '0,0';
    if(decimals > 0){
        format += '.';
        for(var i=0; i<parseInt(decimals); ++i){
            format += '0';
        }
    }
    return numeral(value).format(format);
});

Vue.filter('currency', function (value, decimals, symbol) {
    var format = '0,0';

    if(!decimals){
        decimals = 2;
    }

    if(!symbol){
        symbol = '€';
    }

    if(decimals > 0){
        format += '.';
        for(var i=0; i<parseInt(decimals); ++i){
            format += '0';
        }
    }
    return numeral(value).format(format) + symbol;
});

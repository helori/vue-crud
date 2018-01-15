import Vue from 'vue'

Vue.filter('ucfirst', function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
});

Vue.filter('strtoupper', function (string) {
    return string.toUpperCase();
});

Vue.filter('strtolower', function (string) {
    return string.toLowerCase();
});

Vue.filter('siret', function (siret) {
    siret = siret.replace(/\s/g,'');
    return siret.slice(0, 3) + ' ' + siret.slice(3, 6) + ' ' + siret.slice(6, 9) + ' ' + siret.slice(9);
});
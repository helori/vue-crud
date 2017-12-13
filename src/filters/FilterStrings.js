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

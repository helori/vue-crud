Vue.filter('date', function (value, format) {
    if(value){
        return moment(value, "YYYY-MM-DD hh:mm:ss").format('DD/MM/YYYY');
    }else{
        return '';
    }
});

Vue.filter('datetime', function (value, format) {
    if(value){
        return moment(value, "YYYY-MM-DD hh:mm:ss").format('DD/MM/YYYY à hh:mm');
    }else{
        return '';
    }
});
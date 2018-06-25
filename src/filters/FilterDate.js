import Vue from 'vue'

Vue.filter('date', function (value, format) {
    if(value){
        return moment(value, "YYYY-MM-DD hh:mm:ss").format(format);
    }else{
        return '';
    }
});

Vue.filter('datetime', function (value, format) {
    if(value){
        return moment(value, "YYYY-MM-DD hh:mm:ss").format(format);
    }else{
        return '';
    }
});

Vue.filter('diffInDays', function (dateFrom, dateTo) {
    if(dateFrom && dateTo){
        var dateFrom = moment(dateFrom, "YYYY-MM-DD hh:mm:ss");
        var dateTo = moment(dateTo, "YYYY-MM-DD hh:mm:ss");
        var days = dateTo.diff(dateFrom, 'days');
        return days;
    }else{
        return 0;
    }
});

Vue.filter('secondsToDuration', function (seconds) {
    
    var duration = moment.duration(seconds, 'seconds');

    var h = duration.hours();
    var m = duration.minutes();
    var s = duration.seconds();

    var h = h < 10 ? '0' + h : h;
    var m = m < 10 ? '0' + m : m;
    var s = s < 10 ? '0' + s : s;

    return h + ':' + m + ':' + s;
});
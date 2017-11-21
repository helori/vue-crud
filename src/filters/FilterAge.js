import Vue from 'vue'

Vue.filter('age', function (birthday) {
    if(birthday){
        return moment().diff(moment(birthday, "YYYY-MM-DD hh:mm:ss"), 'years');
    }else{
        return 0;
    }
});

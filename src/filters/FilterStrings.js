import Vue from 'vue'

Vue.filter('ucfirst', function (string) {
	if(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	}else{
		return '';
	}
});

Vue.filter('strtoupper', function (string) {
	if(string){
    	return string.toUpperCase();
    }else{
    	return '';
    }
});

Vue.filter('strtolower', function (string) {
	if(string){
    	return string.toLowerCase();
    }else{
    	return '';
    }
});

Vue.filter('siret', function (siret) {
	if(siret){
		siret = siret.replace(/\s/g,'');
	    return siret.slice(0, 3) + ' ' + siret.slice(3, 6) + ' ' + siret.slice(6, 9) + ' ' + siret.slice(9);
	}else{
		return '';
	}
});
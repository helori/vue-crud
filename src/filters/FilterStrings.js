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

Vue.filter('siren', function (siren) {
    if(siren){
        siren = siren.replace(/\s/g,'');
        return siren.slice(0, 3) + ' ' + siren.slice(3, 6) + ' ' + siren.slice(6, 9);
    }else{
        return '';
    }
});

Vue.filter('pluck', function (items, key) {
    if(items.constructor === Array){
        var results = [];
        _.forEach(items, function(item){
            if(typeof item[key] !== 'undefined'){
                results.push(item[key]);
            }else{
                throw('Missing key ' + key + ' to "pluck" data');
            }
        });
        return results;
    }else{
        throw('Could not "pluck" non-array data');
    }
});

Vue.filter('implode', function (items, separator) {
    if(items.constructor === Array){
        return items.join(separator);
    }else{
        throw('Could not "implode" non-array data');
    }
});

Vue.filter('nl2br', function (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
});

Vue.filter('phone', function (string) {
        
    if(typeof string === 'string' && string && string.length >= 12){
        return string.slice(0, 3) 
            + ' ' + string.slice(3, 4) 
            + ' ' + string.slice(4, 6) 
            + ' ' + string.slice(6, 8) 
            + ' ' + string.slice(8, 10) 
            + ' ' + string.slice(10);
    }
    return string;
});

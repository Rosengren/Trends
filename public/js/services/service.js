// API calls and Node Backend -> Angular Frontend is done here
angular.module('service', [])
.factory('Model', ['$http', function($http) {

	return {
		get : function() {
			return $http.get('/api/models');
		},

		// NOTE: CREATE AND DELETE ARE NOTE HOOKED UP TO app/routes.js
		
		// call to POST and create a new nerd
		create : function(data) {
			return $http.post('/api/models', data);
		},

		// call to DELETE a nerd
		delete : function(id) {
			return $http.delete('/api/models/' + id);
		}
	}
}])

.factory('Store', ['$http', function($http) {

	return {

		get: function() {
			return $http.get('/api/stores');
		}
	}
}]);
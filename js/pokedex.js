var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

/*------ services -------*/

pokeApp.factory('PokemonServices', ['$http', '$q', function($http, $q) {
	var factory = {
		    pokemons: false,
			get: function() {
				var deferred = $q.defer();
				if(factory.pokemons !== false){
					deferred.resolve(factory.pokemons);
				}
				else{
					$http.get('http://pokeapi.co/api/v1/pokedex/1/')
						.success(function(data, status){
							factory.pokemons = data.pokemon;
							deferred.resolve(factory.pokemons);
						})
						.error(function(data, status){
								deferred.reject("Impossible de recupérer les données");
						})
				}
				return deferred.promise;
		    }
	};
	return factory; 
}]);

pokeApp.provider('PokemonService', ['$http', function($http) {
	this.get = function() {
		$http.get('http://pokeapi.co/api/v1/pokedex/1/')
		.success(function(data, status){
			return data.pokemon;
		})
		.error(function(data, status){
			return "Impossible de recupérer les données";
		});
	}
}]);
/*------ controllers -------*/

pokeApp.controller("rechercheCrtl",["$scope", "$log", "PokemonService",function($scope, $log, PokemonService){
	PokemonService.get().then(function(data){
		$scope.pokemons = data;
	}, function(msg){
		alert(msg);
	});
	
	$scope.go = function(){
		$log.info($scope.pokeSelected);
	}
			
}]);

pokeApp.controller("infoCrtl",["$scope", "$log", "InfoService",function($scope, $log, InfoService){
	PokemonService.get().then(function(data){
		$scope.pokemons = data;
	}, function(msg){
		alert(msg);
	});
	
	
	$scope.go = function(){
		$log.info($scope.pokeSelected);
	}
			
}]);
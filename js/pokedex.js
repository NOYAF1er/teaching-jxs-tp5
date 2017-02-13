var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co/api/v1/');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

/*------ services -------*/

/**
 * Charge la liste des pokemeons
 */
pokeApp.factory('PokemonsService', ['$http', '$q', 'POKEAPI', function($http, $q, POKEAPI) {
	var factory = {
		    pokemons: false,
			get: function() {
				var deferred = $q.defer();
				if(factory.pokemons !== false){
					deferred.resolve(factory.pokemons);
				}
				else{
					$http.get(POKEAPI + 'pokedex/1/')
						.success(function(data, status){
							factory.pokemons = data.pokemon;
							deferred.resolve(factory.pokemons);
						})
						.error(function(error, status){
							deferred.reject("Impossible de recupérer les données.");
						})
				}
				return deferred.promise;
		    }
	};
	return factory; 
}]);

/**
 * Charge les informations relatives à un pokemon donné
 */
pokeApp.factory('InfoService', ['$resource', 'POKEAPI', function($resource, POKEAPI) {
	return $resource(POKEAPI + 'pokemon/:id'); 
}]);

/*------ controllers -------*/

/**
 * Recupère tous les pokemeons
 */
pokeApp.controller("pokeListCrtl",["$scope", "$log", "PokemonsService", function($scope, $log, PokemonsService){
	PokemonsService.get().then(function(data){
		$scope.pokemons = data;
	}, function(msg){
		alert(msg);
	});
	
	$scope.go = function(){
		$log.info($scope.pokeSelected);
	}
			
}]);

/**
 * Recupère les informations relatives au pokemon selectionné
 */
pokeApp.controller("pokeViewCrtl",["$scope", "$log", "InfoService", function($scope, $log, InfoService){	
	var info = InfoService.get({id:"1"}, function(){
		$log.info(info);
		$scope.id = info.pkdx_id;
		$scope.name = info.name;
		$scope.moves = info.moves;
		$scope.sprites = info.sprites;
	});
}]);
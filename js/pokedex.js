var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

/*------ services -------*/

/**
 * Charge la liste des pokemons
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
					$http.get(POKEAPI + '/api/v1/pokedex/1/')
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
	return $resource(POKEAPI + '/api/v1/pokemon/:id'); 
}]);

/**
 * Charge les information relative à un sprite
 */
pokeApp.factory('SprintInfoService', ['$resource', 'POKEAPI', function($resource, POKEAPI) {
	var factory = {
		pokemon: $resource(POKEAPI + '/api/v1/pokemon/:id'),
		sprite: function(sp){
			return $resource(POKEAPI + sp);
		}
	}
	return factory; 
}]);

/**
 * Contient l'id et le nom d'un pokemon
 */
pokeApp.factory('pokeService', [function(){
	var factory = {
		id : false,
		name : false
	}
	return factory;
}]);

/*------ controllers -------*/

/**
 * Recupère tous les pokemons
 */
pokeApp.controller("pokeListCrtl",["$scope", "$log", "PokemonsService", "pokeService", function($scope, $log, PokemonsService, pokeService){
	PokemonsService.get().then(function(data){
		$scope.pokemons = data;
	}, function(msg){
		alert(msg);
	});
	
	$scope.go = function(){
		var pokeObject = JSON.parse($scope.pokeSelected);
		$log.warn(pokeObject);
	}

	//Ecoute les changements de valeur de "pokeSelected" depuis la vue et met à jour le service "pokeService"
	$scope.$watch("pokeSelected", function(newValue, oldValue) {
		if($scope.pokeSelected){
			var pokeObject = JSON.parse(newValue); //Converti la chaine de caractère renvoyée par la vue en objet
			//$log.warn(pokeObject);
			pokeService.id = pokeObject.resource_uri.replace('api/v1/pokemon/', '').replace('/', ''); //Recupère l'id à partir de l'URI
			pokeService.name = pokeObject.name;
			//$log.info(pokeService);
		}
	});
}]);

/**
 * Recupère les informations relatives au pokemon selectionné
 */
pokeApp.controller("pokeViewCrtl",["$scope", "$log", "InfoService", "pokeService", "SprintInfoService", function($scope, $log, InfoService, pokeService, SprintInfoService){	
	$scope.pokeSelected = pokeService;

	$scope.$watch("pokeSelected.id", function(newValue, oldValue) {
		var info = SprintInfoService.pokemon.get({id: newValue}, function(){
			$log.info(info);
			$scope.poke = {
				id: info.pkdx_id,
				name: info.name,
				moves: info.moves,
				attack: info.attack,
				speed: info.speed,
				catch_rate: info.catch_rate,
				defense: info.defense,
				exp: info.exp,
				happiness: info.happiness
			};

			var infoSprite = SprintInfoService.sprite(info.sprites[0].resource_uri).get(function(){
				//$log.info(infoSprite);
				$scope.poke.img = infoSprite;
			});

		});
	});

}]);

/*------ directives -------*/

pokeApp.directive('pokedex', function() {
  return {
	  restrict: 'AEC',
	  templateUrl: 'partials/_pokedex.html'
  };
});
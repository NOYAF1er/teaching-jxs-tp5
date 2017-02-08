var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

pokeApp.controller("rechercheCrtl",["$scope", "$log",function($scope, $log){
	$scope.pokemons = [
		{
			id: 1,
			nom: "pickachu"
		},
		{
			id: 2,
			nom: "toto"
		},
		{
			id: 3,
			nom: "pickacho"
		},
		{
			id: 4,
			nom: "don quichot"
		},
		{
			id: 6,
			nom: "danichu"
		},
	];
	
	$scope.go = function(){
		$log.info($scope.model);
	}
			
}]);
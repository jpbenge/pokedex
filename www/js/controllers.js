angular.module('pokemon.controllers', [])

.controller('PokedexCtrl', function($scope, Dex) {
  $scope.pokedex = [];
  Dex.all().then(function(data, status, header, config){
    $scope.pokedex = data.data;
    Dex.sanitize($scope.pokedex);
    Dex.sprites($scope.pokedex);
  });
  //console.log('CONTROLLER'+$scope.pokedex);
})

.controller('TeamCtrl', function($scope, $stateParams, Dex){
  
  $scope.team = Dex.getTeam();
  $scope.filled = Dex.filled();
  $scope.remove = function(pokemon)
  {
    Dex.remove(pokemon);
  }
  $scope.filled = Dex.filled();
})

.controller('PokemonCtrl', function($scope, $stateParams, Dex, $ionicLoading){  
  $scope.filled = Dex.filled();
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };
  $scope.add = function(pokemon)
  {
    Dex.add(angular.copy(pokemon));
  }
  $scope.show();
  Dex.get($stateParams.id).then(function(data, status, header, config){
    $scope.pokemon = data.data;
    console.log(data);
    Dex.sanitizeDetails($scope.pokemon);
    Dex.bigImage($scope.pokemon.id, $scope.pokemon.name)
    .then(function(data, status, header, config) {
      //console.log(data);
      $scope.pokemon.image = data.data.query.pages[-1].imageinfo[0].url;
      $scope.hide();
    });
    /*
    Dex.description($scope.pokemon.id).then(function(data, status, header, config) {
      //console.log(data.data);
      $scope.pokemon.description = data.data.description;
    })
    */
  });
  
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

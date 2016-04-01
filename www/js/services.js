angular.module('pokemon.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('Dex',function($http) {
  var pkLookup = {};
  var team = [];
  var filled = ['inactive', 'inactive', 'inactive', 'inactive', 'inactive', 'inactive'];
  function getAll() {
  return $http.get('http://pokeapi.co/api/v2/pokemon-species');
  
  }
  function sanitizeAll(pokedex) {
    angular.forEach(pokedex, function(value, key) {
      value.id = key+1;
      value.name = sanitize(value.name);
      pkLookup[value.name] = value.id;
    })
  }
  function sanitize(name) {
    if (name === 'nidoran-f')
      {
        name = 'nidoran ♀';
      }
      if (name === 'nidoran-m')
      {
        name = 'nidoran ♂';
      }
      if (name === 'flabebe')
      {
        name = 'flabébé';
      }
      if (name === 'farfetchd')
      {
        name = 'farfetch\'d'
      }
      if (name === 'mr-mime')
      {
        name = 'Mr. Mime';
      }
      return name;
  }

  function getWholeTeam() {
    return team;
  }

  function addTeam(pokemon)
  {
    if (team.length < 6)
    {
      team.push(pokemon);
      filled[team.indexOf(pokemon)] = 'active';
    }
    console.log(team);
  }

  function removeFromTeam(pokemon) {
    if (team.indexOf(pokemon) >= 0)
    {
      filled[team.indexOf(pokemon)] = 'inactive';
      team.splice(team.indexOf(pokemon),1);
    }
  }

  function fixDetails(pokemon) {
      pokemon.height = Number(pokemon.height)/10;
      pokemon.weight = Number(pokemon.weight)/10;
      pokemon.name = capitalize(sanitize(pokemon.name));
  }

  function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
  }

  function capitalize(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }   

  function getSprites(pokedex)
  {

      //request sprites
      
      angular.forEach(pokedex, function(value, key){      
        
        //$http.get('http://pokeapi.co/api/v1/sprite/'+(key+2)).then(function(spriteResponse){
        $http.jsonp('http://bulbapedia.bulbagarden.net/w/api.php?action=query&continue=&titles=Image:'+zeroPad(key+1,3)+'.png&prop=imageinfo&iiprop=url&format=json&callback=JSON_CALLBACK')
        .then(function(spriteResponse) { 
          //console.log(spriteResponse);
          //value.sprite = 'http://pokeapi.co/'+spriteResponse.data.image;
          if (value.sprite = spriteResponse.data.query.pages[-1].imageinfo != null) {
            value.sprite = spriteResponse.data.query.pages[-1].imageinfo[0].url;
          }
          else {
            $http.jsonp('http://bulbapedia.bulbagarden.net/w/api.php?action=query&continue=&titles=Image:'+zeroPad(key+1,3)+capitalize(value.name)+'.png&prop=imageinfo&iiprop=url&format=json&callback=JSON_CALLBACK')
            .then(function(bigResponse) {
              value.sprite = bigResponse.data.query.pages[-1].imageinfo[0].url;

            },function(bigError) {
              console.error(key+1,bigError);
            })
          }
        }, function(spriteError){
          console.error(key+1, spriteError);
        })
      });
  }
  
  function getDetails(id)
  {
      console.log(id);
      return $http.get('http://pokeapi.co/api/v2/pokemon/'+id);
  }

  function getDescription(id)
  {
      return $http.get('http://pokeapi.co/api/v1/description/'+id);
  }

  function getBigImage(id, name) 
  {
    console.log(id);
    if (name === 'Nidoran ♂' || name === 'Nidoran ♀')
    {
      name = name.substring(0,name.indexOf(' '));
    }
    name = sanitize(name);
    console.log(name);
    return $http.jsonp('http://bulbapedia.bulbagarden.net/w/api.php?action=query&continue=&titles=Image:'+zeroPad(id,3)+capitalize(name)+'.png&prop=imageinfo&iiprop=url&format=json&callback=JSON_CALLBACK')
  }

  return {
    all: function() {
      return getAll();
    },
    sprites: function(pokedex) {
      getSprites(pokedex);
    },
    sanitize: function(pokedex) {
      sanitizeAll(pokedex);
    },
    getName: function(name) {
      return pkLookup[name];
    },
    get: function(name) {
      return getDetails(name);
    },
    description: function(id) {
      return getDescription(id);
    },
    bigImage: function(id,name) {
      return getBigImage(id,name);
    },
    sanitizeDetails: function (pokemon) {
      return fixDetails(pokemon);
    },
    getTeam: function () {
      return getWholeTeam();
    },
    add: function (pokemon) {
      addTeam(pokemon);
    },
    remove: function (pokemon) {
      removeFromTeam(pokemon);
    },
    filled: function () {
      return filled;
    }
  }
});

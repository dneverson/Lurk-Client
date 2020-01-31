/*=========================================================================
* @author Derry Everson
* 01/30/2020
*========================================================================*/

(function(){
  var formApp = angular.module('lurkApp', []);
  formApp.controller('lurkController', function ($scope, $parse, $window, $interval) {

    // Sample data until backend is rolled in
    $scope.data = {
      connection: {address:"127.0.0.1",port:5590},
      gameStatus: {connect:1,charCreate:0,gamePlay:0},
      gameDesc:"While having a cup of tea atop an old house, you accidentally fall through the roof into a small broom closet. There is no way back to the roof, but a door leads out of the closet. After allocating a combined total of 100 points of attack, defense, and regeneration, you prepare to open the door and discover what lays beyond.",
      messages: [
        {name:"Bob", msg:"Hello", sys:0},
        {name:"Ralf", msg:"Hi!", sys:0},
        {name:"System", msg:"Error: 07 unable to find Bob", sys:1},
      ],
      userInput: "",
      player: {name:"Bob", hp:100,atk:0,def:0,reg:0,gold:100,tPts:100,rPts:0,desc:""},
      players: [
        {name:"Ralf", hp:100,atk:50,def:40,reg:10,gold:100,alive:1},
        {name:"Jim", hp:100,atk:50,def:40,reg:10,gold:100,alive:1},
        {name:"Frank", hp:100,atk:50,def:40,reg:10,gold:100,alive:1},
        {name:"Sally", hp:100,atk:50,def:40,reg:10,gold:100,alive:1},
        {name:"Suzan", hp:100,atk:50,def:40,reg:10,gold:100,alive:1}
      ],
      monsters: [
        {name:"Red", hp:1000,atk:520,def:40,reg:10,gold:10000,alive:1},
        {name:"Green", hp:1900,atk:150,def:40,reg:10,gold:15600,alive:1},
        {name:"Blue", hp:700,atk:550,def:40,reg:10,gold:10560,alive:1},
        {name:"Yellow", hp:900,atk:150,def:40,reg:10,gold:156700,alive:1},
        {name:"Orange", hp:500,atk:150,def:40,reg:10,gold:156700,alive:1}
      ],
      loots: [
        {name:"Frank", hp:0,atk:50,def:40,reg:10,gold:100,alive:0},
        {name:"Sally", hp:0,atk:50,def:40,reg:10,gold:100,alive:0},
        {name:"Suzan", hp:0,atk:50,def:40,reg:10,gold:100,alive:0}
      ],
      currentTable: {name: "",type: 1,entities: [],},
      playerSelected: "All",
      rooms: ["Rm 1","Rm 2","Rm 3","Rm 4"],
      roomSelected: "",
      currentRoom: {name:"Fartssss",desc:"A stinky warm substance is in the air"}
    };

    /*=======================================================================*
    * Player Interaction Buttons
    *========================================================================*/
    $scope.connect = function(loc,port){
      var isLocValid = validateLoc(loc)?1:error(3);
      var isPortValid = validatePort(port)?1:error(4);
      if(isLocValid && isPortValid){
        $scope.data.gameStatus.connect=0;
        $scope.data.gameStatus.charCreate=1;
      }
    };
    $scope.updatePoints = function(){
      var obj = $scope.data.player;
      obj.rPts = ((obj.tPts)-(obj.def+obj.atk+obj.reg));
      if(!(obj.def+obj.atk+obj.reg)) obj.def=obj.atk=obj.reg=0;
    };
    $scope.startGame = function(player){
      var isValid = validatePlayer(player);
      if(isValid){
        $scope.data.gameStatus.charCreate=0;
        $scope.data.gameStatus.gamePlay=1;
      }
    };
    $scope.pvp = function(target){
      console.log(JSON.stringify(target));
    };
    $scope.attack = function(target){
      console.log(JSON.stringify(target));
    };
    $scope.loot = function(target){
      console.log(JSON.stringify(target));
    };
    $scope.sendMessage = function(player, data){
      if(!data) return;
      setMessage(player, data)
    }
    $scope.gotoRoom = function(data){
      if(!data) return;
      setRoom(data);
      updateData();
    }
    $scope.generateCharacter = function(){
      generateName();
      generateStats(100);
    };
    $scope.updateTable = function(data){
      if(data == 1){
        $scope.data.currentTable.name = "Player";
        $scope.data.currentTable.type = data;
        $scope.data.currentTable.entities = $scope.data.players;
      }else if(data == 2){
        $scope.data.currentTable.name = "Monster"
        $scope.data.currentTable.type = data;
        $scope.data.currentTable.entities = $scope.data.monsters;
      }else if(data == 3){
        $scope.data.currentTable.name = "Player"
        $scope.data.currentTable.type = data;
        $scope.data.currentTable.entities = $scope.data.loots;
      }
    };

    /*=======================================================================*
    * local Functions
    *========================================================================*/
    function validateLoc(loc){
      return (loc)?1:0;
    };
    function validatePort(port){
      return ((port)>=0&&(port)<=9000)?1:0;
    };
    function validatePlayer(player){
      var stat = (player.atk + player.def + player.reg)<=player.tPts;
      var nLen = ((player.name.length)<=10)?1:error(1);
      var dLen = ((player.desc.length)<=30)?1:error(2);
      if(stat && nLen && dLen) return 1;
      else return 0;
    };
    function error(type){
      console.log("Error, Type: "+type);
    };
    function updateData(){
      //$scope.data.messages = getMessages();
      //$scope.data.rooms = getRooms();
    };
    function getRooms(){
      // Reciving rooms from server
      var result = ["Rm 1","Rm 2","Rm 3","Rm 4","Rm 5"];
      return result;
    };
    function getMessages(){
      // Reciving message from server
    };
    function setRoom(data){
      // Sending goto room to server
      console.log("Room Changed to: "+data);
      getRooms();
    };
    function setMessage(player, data){
      // Sending message to server
      console.log("Sent \""+player+"\": "+data);
      clearInput();
    };
    function clearInput(){
      $scope.data.userInput = "";
    };
    function randInt(min, max){
      return (Math.floor(Math.random()*(max-min))+min);
    };
    function generateName(){
      var names = ["Sally","Susan","Frank","Ralph","Jimmy","George"];
      var result = names[randInt(0,names.length+1)]+randInt(0,9999);
      $scope.data.player.name = result;
    };
    function generateStats(value){
      var max = value;
      var attck = randInt(0, max);
      var defen = randInt(0, max-attck);
      var regen= (max-attck-defen);
      var sum = (attck+defen+regen);
      if(sum == 100){
        $scope.data.player.atk = attck;
        $scope.data.player.def = defen;
        $scope.data.player.reg = regen;
      }else{
        console.log("opps!");
      }
    };

    window.onbeforeunload = function() {
      return "Leaving or Reloading will terminate your connection to the Lurk server";
    };

    /*=======================================================================*
    * Run one time when content is loaded properly
    *========================================================================*/
    angular.element(function () {
      //init();
    });

    /*=======================================================================*
    * Will be used to auto update Data recived from server
    *========================================================================*/
    setInterval(function(){
      updateData();
      // For table Digestion issues if they arrise
      //try{$scope.$digest()}catch(e){}
    }, 2000);

  });
}());

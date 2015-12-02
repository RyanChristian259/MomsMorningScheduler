app.controller('accountInfoController', ['$scope', '$http', '$location', '$firebase', '$route', '$routeParams', '$firebaseArray', '$firebaseObject', 'userService', 'authService', '$window', function($scope, $http, $location, $firebase, $route, $routeParams, $firebaseArray, $firebaseObject, userService, authService, $window  ) {

  var self = this;

  var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");

  var usersCollection = ref.child("users");

  var userKey = userService.currentUserKey;

$scope.refreshPage = function(){
   $window.location='#/accountInfo';
        $window.location.reload();
        console.log('refreshed');
  };

//***********************************//
//      User set Personal Info       //
//***********************************//
$scope.userInfo = function(){


  var userFirstNameRef = new Firebase("https://momsmorningscheduler.firebaseio.com/users/" + $scope.key + "/firstName");
  var userLastNameRef = new Firebase("https://momsmorningscheduler.firebaseio.com/users/" + $scope.key + "/lastName");
  var userStreetRef = new Firebase("https://momsmorningscheduler.firebaseio.com/users/" + $scope.key + "/street");
  var userCityRef = new Firebase("https://momsmorningscheduler.firebaseio.com/users/" + $scope.key + "/city");
  var userStateRef = new Firebase("https://momsmorningscheduler.firebaseio.com/users/" + $scope.key + "/state");
  var userZipRef = new Firebase("https://momsmorningscheduler.firebaseio.com/users/" + $scope.key + "/zip");
  var userPhoneRef = new Firebase("https://momsmorningscheduler.firebaseio.com/users/" + $scope.key + "/phone");

  // download the data into a local object
  var syncFirstNameObject = $firebaseObject(userFirstNameRef);
  var syncLastNameObject = $firebaseObject(userLastNameRef);
  var syncStreetObject = $firebaseObject(userStreetRef);
  var syncCityObject = $firebaseObject(userCityRef);
  var syncStateObject = $firebaseObject(userStateRef);
  var syncZipObject = $firebaseObject(userZipRef);
  var syncPhoneObject = $firebaseObject(userPhoneRef);

  // synchronize the object with a three-way data binding
  syncFirstNameObject.$bindTo($scope, "firstName");
  syncLastNameObject.$bindTo($scope, "lastName");
  syncStreetObject.$bindTo($scope, "street");
  syncCityObject.$bindTo($scope, "city");
  syncStateObject.$bindTo($scope, "state");
  syncZipObject.$bindTo($scope, "zip");
  syncPhoneObject.$bindTo($scope, "phone");

};


//***********************************//
//         Check Login State         //
//***********************************//
var authData = ref.getAuth();
if (authData) {
  // console.log("User " + authData.uid + " is logged in with auth controller " + authData.provider);
  $scope.authData = authData;
  $scope.greetUser = authData.password.email;
} else {
  console.log("User is logged out");
}

//***********************************//
//   Call Database for user kids     //
//***********************************//
$scope.populateUserKids = function(){
  var kids = [];
  var userRef = new Firebase('https://momsmorningscheduler.firebaseio.com/users/' + $scope.key);
  userRef.on("value", function(snapshot) {
    firebaseKids = snapshot.exportVal();
    //loop through events to get kids info
    var kidsInfo = firebaseKids.children;
      for(var key in kidsInfo){
        kids.push(kidsInfo[key]);
      }

    $scope.kids = kids;
    // kids = [];
    // console.log($scope.kids, ' children');
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
};

//***********************************//
//  Call Database for user events    //
//***********************************//
$scope.populateUserEvents = function(){
  var displayMyEvents = [];
  var userRef = new Firebase('https://momsmorningscheduler.firebaseio.com/events/');
  userRef.on("value", function(snapshot) {
    firebaseMyEvents = snapshot.exportVal();
    //loop through events to get kids info
    var allEventsObject = firebaseMyEvents;
    for(var key in allEventsObject){
      //key is is the firebase key for the day
      myEvents = allEventsObject[key];
      for (var key6 in myEvents.reservations){
        if($scope.key === myEvents.reservations[key6].user_id){
          displayMyEvents.push({title: myEvents.title, start: myEvents.start, end:myEvents.end, childName: myEvents.reservations[key6].childName, key:key, resNumber: key6 });
        // console.log(myEvents.reservations[key6].childName, ' display reservations child name');
      }
    }
  }
  $scope.displayMyEvents = displayMyEvents;
  displayMyEvents = [];
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
};

//***********************************//
//            Delete Event           //
//***********************************//
$scope.deleteEvent = function(data) {
  console.log(' delete event trying');
  var firebaseDeleteRef = new Firebase("https://momsmorningscheduler.firebaseio.com/events/" + this.event.key + '/reservations/' + this.event.resNumber+ '/');
  firebaseDeleteRef.update({"user_id": '', "childName": null});
};

//*******************************//
//    Add children callback      //
//*******************************//
$scope.child = {};
$scope.addKidCallback = function () {

 var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/users");
 var key = '';
 var childData = $scope.child;
 ref.on("value", function(snapshot) {
  snapshot.forEach(function (childSnapshot) {
    if (authData.uid === childSnapshot.val().id) {
      $scope.key = childSnapshot.key();
      userService.currentUserKey = $scope.key;
      console.log($scope.key, ' key available');
    }
  });
  $scope.populateUserKids();
  $scope.populateUserEvents();
  $scope.userInfo();
});
};

$scope.addKidCallback();


//*******************************//
//          Add a child          //
//*******************************//
$scope.addKid = function(){
  var userRef = new Firebase('https://momsmorningscheduler.firebaseio.com/users/' + $scope.key + '/children');
      //birthdate set to string so database will accept it
      // var selectedBirthdate = userService.CurrentDate
      var data = {
        name: $scope.child.name,
        birthdate: userService.currentDate
      };

    // Push data into database
    userRef.push(data);
  };

}]);//End Controller

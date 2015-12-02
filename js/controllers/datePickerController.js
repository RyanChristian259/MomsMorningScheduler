app.controller('datePickerController', ['$scope', '$location', '$firebase', '$firebaseArray', '$rootScope', 'userService', function($scope, $location, $firebase, $firebaseArray, $rootScope, userService) {


  $scope.today = function() {
    $scope.dt = new Date();
  };

  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();


//**Set Max Date for Scheduling availibility**//
//Change the num after .getFullYear to adjust
//Currently set to 2 years out from current date
var setMaxDateYear = new Date().getFullYear();
var setMaxDateMonth = new Date().getMonth() + 24;
$scope.maxDate = new Date(setMaxDateYear, setMaxDateMonth, 1);

//
$scope.open = function($event) {
  $scope.status.opened = true;
};

$scope.setDate = function(year, month, day) {
  $scope.dt = new Date(year, month, day);
};

$scope.dateOptions = {
  formatYear: 'yy',
  startingDay: 1
};

$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];

$scope.status = {
  opened: false
};


//**************************************//
//      Set date from datepicker        //
//**************************************//
// Set current date as default on page load
var cleanDate = moment($scope.dt).format('YYYY-MM-DD');
  userService.currentDate = cleanDate;
  var payload = {
    'timeStamp': userService.currentDate
  };
  $scope.payload = payload;

//Change date when selected from picker
$scope.changeDate = function() {
  var cleanDate = moment($scope.dt).format('YYYY-MM-DD');
  userService.currentDate = cleanDate;
  var payload = {
    'timeStamp': userService.currentDate
  };
  $scope.payload = payload;
};


//*****************************//
//  Query database for events  //
//*****************************//
$scope.getData = function() {
  queryArray = [];
  var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/events");
  ref.orderByChild('date/time').on("child_added", function(snapshot) {
   var query = snapshot.exportVal();
   var pushedQuery = queryArray.push(query);
    });
  $scope.query = queryArray;
};

//***************************//
//  Disable selected days    //
//***************************//
$scope.disabled = function(date, mode) {
  $scope.sunday = null; //0 to disable, null to enable
  $scope.monday = null; //1 to disable, null to enable
  $scope.tuesday = null; //2 to disable, null to enable
  $scope.wednesday = null; //3 to disable, null to enable
  $scope.thursday = null; //4 to disable, null to enable
  $scope.friday = null; //5 to disable, null to enable
  $scope.saturday = null; //6 to disable, null to enable
  return ( mode === 'day' && ( date.getDay() === $scope.sunday || date.getDay() === $scope.monday || date.getDay() === $scope.tuesday || date.getDay() === $scope.wednesday || date.getDay() === $scope.thursday || date.getDay() === $scope.friday || date.getDay() === $scope.saturday ) );
};


var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var afterTomorrow = new Date();
afterTomorrow.setDate(tomorrow.getDate() + 2);


// Attach an asynchronous callback to read the data at our posts reference
$scope.callBack = function(){
  var dateChosen = moment($scope.dt).format('DD/MM/YYYY');

  var inEvents;
  var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/events");
  ref.on("value", function(snapshot) {
    snapshot.forEach(function (childSnapshot){
      var key = childSnapshot.key();
        console.log(key, " key");
      var childData = childSnapshot.val();
      console.log(childData, ' key')
       if (dateChosen === childData.date) {
          var ref2 = new Firebase("https://momsmorningscheduler.firebaseio.com/events/" + key + '/slots');
          ref2.update({
            0: true
          });
      }


    });
  events2 = snapshot.exportVal();


  $rootScope.events2 = events2;
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
};

var ref3 = new Firebase("https://momsmorningscheduler.firebaseio.com/workDays");
ref3.orderByChild("workDays/date").on("child_added", function(snapshot) {
  console.log('status ' + snapshot.key() + ' ' + snapshot.val().status + " date " + snapshot.val().date);
});


var obj = $rootScope.events2;
//return an array of values that match on a certain key
$scope.getValues = function(obj, key) {
    var objects = [];
    for (var i in obj) {
      console.log(i, ' events in func');
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    console.log(objects, ' objects');
    return objects;
};


$scope.getDayClass2 = function(date, mode) {
  if (mode === 'day') {
    var dayToCheck = new Date(date).setHours(0,0,0,0);
    for (var i = 0; i < $rootScope.events2.length; i ++){
      var currentDay = new Date($rootScope.events2[i].date).setHours(0,0,0,0);
      if (dayToCheck === currentDay && $rootScope.events2[i].slots[i] === false) {
        return $rootScope.events2[i].status;
      }
    }
  }
  return '';
};

}]); //calendar controller

app.controller('calendarController', ['$scope', '$location', '$firebase', '$firebaseArray', function($scope, $location, $firebase, $firebaseArray) {


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

$scope.changeDate = function() {
  var cleanDate = moment($scope.dt).format('DD/MM/YYYY');
  var payload = {
    'timeStamp': cleanDate
  };


  $scope.payload = payload;
    // console.log($scope.payload);
  };

  $scope.submitDate = function() {
    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");
    var workDaysCollection = ref.child("workDays");
    var payloadStringified = JSON.stringify($scope.payload);
    var payloadParsed = JSON.parse(payloadStringified);
    workDaysCollection.push(payloadParsed);
    // console.log($scope.workDaysCollection, ' open');
  };



//Admin submit date in picker window to the database
$scope.createEvent = function() {
  var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/workDays");

    var payloadStringified = JSON.stringify($scope.payload);

    var payloadParsed = JSON.parse(payloadStringified);

    var formData = {
      events: {
        date: $scope.payload.timeStamp,
        begin: $scope.selectedStartHour + ':' + $scope.selectedStartMinute + ' ' + $scope.selectedStartampm,
        end: $scope.selectedEndHour + ':' + $scope.selectedEndMinute + ' ' + $scope.selectedEndampm,
        slots:{0:false,1:false,2:false,3:false}
        }
    };
      console.log(formData, ' form data');
    console.log('Data Sent');
    ref.push(formData);
  };



    // type: 'morning',
    // begin: 0830,
    // end: 1230,
    // date: 'Nov 23 2015',
    // status: 'full',
    // slots :{
    //  0: false,
    //  1: false,
    //  2: false,
    //  3: false

  $scope.getData = function() {
    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com");
    queryArray = [];

    ref.orderByChild('date/time').on("child_added", function(snapshot) {

     var query = snapshot.exportVal();

     var pushedQuery = queryArray.push(query);
      // console.log(query);

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

$scope.changeSlots = function(data) {

    // var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/workdays");

    // ref.orderByChild("date/schedule/time").equalTo("2015-11-13T19:24:21.465Z").on('childAdded', function (snapshot) {
    //    console.log(snapshot.key());
    // });



var payload = data;
    // var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/workDays");

    // ref.orderByChild('date')

    // ref.update(payload);


  };

  // $('span').on('click', function(){
  //   var buttonClicked = $(this).html();
  //   console.log(buttonClicked, ' click');
  // });

// angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);
// angular.module('ui.bootstrap.demo').controller('DatepickerDemoCtrl', function ($scope) {

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);

  $scope.events = [
  {
    type: 'morning',
    begin: 0830,
    end: 1230,
    date: 'Nov 23 2015',
    status: 'full',
    slots :{
     0: false,
     1: false,
     2: false,
     3: false
   }
 },
 {
  type: 'morning',
  begin: 0830,
  end: 1230,
  date: 'Nov 24 2015',
  status: 'full',
  slots :{
    0: true,
    1: true,
    2: true,
    3: true
 }
},
{
  type: 'morning',
  begin: 0830,
  end: 1230,
  date: 'Nov 25 2015',
  status: 'full',
  slots :{
    0: false,
    1: false,
    2: false,
    3: false
 }
},
{
  type: 'morning',
  date: 'Nov 30 2015',
  begin: 0830,
  end: 1230,
  status: 'full',
  slots :{
    0: false,
    1: false,
    2: false,
    3: false
 }
}
];

//process events to show if slots are available
$scope.processEvents = function(events){
  var numSlots = 0;
  for (var i = 0; i < $scope.events.length; i ++){
    for (var j = 0; j < $scope.events.length; j ++)
    if( $scope.events[i].slots[j] === false){
      numSlots += 1;
    }
  }
    return numSlots;
};
$scope.processEvents($scope.events);



$scope.getDayClass = function(date, mode) {
  if (mode === 'day') {
    var dayToCheck = new Date(date).setHours(0,0,0,0);
    for (var i = 0; i < $scope.events.length; i ++){
      var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
      // console.log(currentDay, ' current day');
      if (dayToCheck === currentDay && $scope.events[i].slots[i] === false) {
        return $scope.events[i].status;
      }
    }
  }
  return '';
};

// app.controller('DatepickerDemoCtrl', function ($scope) {
//   $scope.today = function() {
//     $scope.dt = new Date();
//   };
//   $scope.today();

//   $scope.clear = function () {
//     $scope.dt = null;
//   };

  // $scope.open = function($event) {
  //   $scope.status.opened = true;
  // };

  // $scope.setDate = function(year, month, day) {
  //   $scope.dt = new Date(year, month, day);
  // };

//   $scope.dateOptions = {
//     formatYear: 'yy',
//     startingDay: 1
//   };

//   $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
//   $scope.format = $scope.formats[0];

//   $scope.status = {
//     opened: false
//   };

//   var tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   var afterTomorrow = new Date();
//   afterTomorrow.setDate(tomorrow.getDate() + 2);
//   $scope.events =
//     [
//       {
//         date: tomorrow,
//         status: 'full'
//       },
//       {
//         date: afterTomorrow,
//         status: 'partially'
//       }
//     ];


//     return '';
//   };
// });


$scope.startHourSelect = [
      { id: 1, name: '1' },
      { id: 2, name: '2' },
      { id: 3, name: '3' },
      { id: 4, name: '4' },
      { id: 5, name: '5' },
      { id: 6, name: '6' },
      { id: 7, name: '7' },
      { id: 8, name: '8' },
      { id: 9, name: '9' },
      { id: 10, name: '10' },
      { id: 11, name: '11' },
      { id: 12, name: '12' },
      ];

    // Pre-select value by id
    $scope.selectedStartHour = 8;

$scope.startMinuteSelect = [
      { id: 00, name: '00' },
      { id: 05, name: '05' },
      { id: 10, name: '10' },
      { id: 15, name: '15' },
      { id: 20, name: '20' },
      { id: 25, name: '25' },
      { id: 30, name: '30' },
      { id: 35, name: '35' },
      { id: 40, name: '40' },
      { id: 45, name: '45' },
      { id: 50, name: '50' },
      { id: 55, name: '55' },
      ];

    // Pre-select value by id
    $scope.selectedStartMinute = 30;

$scope.startampmSelect = [
      { id: 'am', name: 'am' },
      { id: 'pm', name: 'pm' }
      ];

    // Pre-select value by id
    $scope.selectedStartampm = 'am';

$scope.endHourSelect = [
      { id: 1, name: '1' },
      { id: 2, name: '2' },
      { id: 3, name: '3' },
      { id: 4, name: '4' },
      { id: 5, name: '5' },
      { id: 6, name: '6' },
      { id: 7, name: '7' },
      { id: 8, name: '8' },
      { id: 9, name: '9' },
      { id: 10, name: '10' },
      { id: 11, name: '11' },
      { id: 12, name: '12' },
      ];

    // Pre-select value by id
    $scope.selectedEndHour = 12;

$scope.endMinuteSelect = [
      { id: 00, name: '00' },
      { id: 05, name: '05' },
      { id: 10, name: '10' },
      { id: 15, name: '15' },
      { id: 20, name: '20' },
      { id: 25, name: '25' },
      { id: 30, name: '30' },
      { id: 35, name: '35' },
      { id: 40, name: '40' },
      { id: 45, name: '45' },
      { id: 50, name: '50' },
      { id: 55, name: '55' },
      ];

    // Pre-select value by id
    $scope.selectedEndMinute = 30;

$scope.endampmSelect = [
      { id: 'am', name: 'am' },
      { id: 'pm', name: 'pm' }
      ];

    // Pre-select value by id
    $scope.selectedEndampm = 'pm';



}]); //calendar controller

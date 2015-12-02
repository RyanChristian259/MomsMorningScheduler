app.controller('calendarController', ['$scope', '$firebase', '$firebaseArray', '$location', '$compile', '$timeout', 'uiCalendarConfig','$rootScope','userService', 'authService', function($scope, $firebase, $firebaseArray, $location, $compile, $timeout, uiCalendarConfig, $rootScope, userService, authService) {

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  $scope.show0to24 = false;

//***********************************//
//         Check Login State         //
//***********************************//
var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");
var authData = ref.getAuth();
if (authData) {
  // console.log("User " + authData.uid + " is logged in with calendar controller " + authData.provider);
  // $scope.show = true;
  // console.log(' auth data ', authData);
} else {
  console.log("User is logged out", authData);
  // $scope.show = false;
}


var payload = {};
$scope.payload = payload;
window.cal = uiCalendarConfig;

//***********************************//
//     Firebase eventsReference      //
//***********************************//
var eventsRef = new Firebase("https://momsmorningscheduler.firebaseio.com/events");

//***********************************//
//  Admin submit date to database    //
//***********************************//
$scope.addEventToDatabase = function(date, jsEvent, view) {
  var payloadStringified = JSON.stringify($scope.payload);
  var payloadParsed = JSON.parse(payloadStringified);
  var newStartDateTime = (userService.currentDate + ' ' + $scope.selectedStartHour + ':' + $scope.selectedStartMinute + ' ' + $scope.selectedStartampm).toString();
  var newEndDateTime = (userService.currentDate + ' ' + $scope.selectedEndHour + ':' + $scope.selectedEndMinute + ' ' + $scope.selectedEndampm).toString();
console.log(newStartDateTime, ' start hour');

  var formData = {
    title: 'Morning Session',
    start: newStartDateTime,
    end: newEndDateTime,
    reservations:{0:{user_id: '', age:'2-6 year old', resNumber: 0},1:{user_id: '', age:'2-6 year old', resNumber: 1},2:{user_id: '', age:'0-6 year old', resNumber: 2},3:{user_id: '', age:'0-6 year old', resNumber: 3}},
  };
  eventsRef.push(formData);
};


//$scope.events and $scope.eventSources are
//necessary for UI Calendar to read events
$scope.events = [];
$scope.eventSources = [$scope.events];

//***********************************//
//     Call Database for events      //
//***********************************//
$scope.callBack = function(){
  eventsRef.on("value", function(snapshot) {
    $scope.events.splice(0);
    firebaseEvents = snapshot.exportVal();
    var counter = 0;
    //loop through events to get num of reserved events
    for(var key in firebaseEvents){
      // console.log(new Date, ' date');
      var clientSideEvent  = firebaseEvents[key];
      clientSideEvent.key = key;
      //break into client events object
      for (var key2 in clientSideEvent.reservations){
        if(clientSideEvent.reservations[key2].user_id !== ""){
                //count num of reserved slots for each event
                counter += 1;
              }
            }
            if(counter >= 4 ){
              console.log('Hold the event');
            } else {
              $scope.events.push(clientSideEvent);
            }
            //reset counter for each new event
            counter = 0;
          }
          $scope.$apply();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
};

var init = function(){
  $scope.callBack();
    };//End addEventToDatabase

    // Call init to populate calendar on page load
    // Must be called after admin submit function
    init();

//***********************************//
// Show desired age details on click //
//***********************************//
    $scope.show0to24Months = function(date, jsEvent, view){
     $scope.show0to24 = true;
   };

   $scope.showAll = function(){
     $scope.show0to24 = false;
   };

//***********************************//
//   Show event details on click     //
//***********************************//
$scope.alertOnEventClick = function(date, jsEvent, view){
  var showAvailableSlots = [];
  for(var key in date.reservations){
    if($scope.show0to24 === true && date.reservations[key].user_id === "" && date.reservations[key].age === "0-6 year old"){
      showAvailableSlots.push(date.reservations[key].age + ' ' + key);
      $scope.showAvailableSlots = showAvailableSlots;
    } else {
      if(date.reservations[key].user_id === "" && $scope.show0to24 === false){
        showAvailableSlots.push(date.reservations[key].age + ' ' + key);
        $scope.showAvailableSlots = showAvailableSlots;
      }
    }
    if(showAvailableSlots.length > 0){
      $scope.alertMessage = ( date.title + ' on ' + date.start.format('MM/DD/YYYY') + ' for a ');
    } else {
     $scope.alertMessage = ('This date is already full. Please choose another');
   }
   $scope.date = date;

   $scope.cleanDate = moment(date.start).format('DD/MM/YYYY');
   $scope.selectedDateKey = date.key;
 }
};

/* alert on Drop */
$scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
  $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
};
/* alert on Resize */
$scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
  $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
};
/* add and removes an event source of choice */
$scope.addRemoveEventSource = function(sources,source) {
  var canAdd = 0;
  angular.forEach(sources,function(value, key){
   if(sources[key] === source){
     sources.splice(key,1);
     canAdd = 1;
   }
 });
  if(canAdd === 0){
    sources.push(source);
  }
};

/* remove event */
$scope.remove = function(index) {
  $scope.events.splice(index,1);
};
/* Change View */
$scope.changeView = function(view,calendar) {
  uiCalendarConfig.calendars[calendar].fullCalendar('removeEvents');
  uiCalendarConfig.calendars[calendar].fullCalendar('addEventSource', $scope.events);

  uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
};
/* Render Calendar */
$scope.renderCalender = function(calendar) {
  $timeout(function() {
    if(uiCalendarConfig.calendars[calendar]){
      uiCalendarConfig.calendars[calendar].fullCalendar('render');
    }
  });
};

/* Render Tooltip */
$scope.eventRender = function( event, element, view ) {
  $timeout(function(){
   $(element).attr('tooltip', event.title);
   $compile(element)($scope);
 });
};
/* config object */
$scope.uiConfig = {
  calendar:{
    height: 450,
    editable: false,
    header:{
      left: 'title',
      center: '',
      right: 'today prev,next'
    },
    eventClick: $scope.alertOnEventClick,
    eventDrop: $scope.alertOnDrop,
    eventResize: $scope.alertOnResize,
    eventRender: $scope.eventRender
  }
};


/* event sources array*/
      // $scope.events is your events with the following keys:
      // title, start, end, allDay
$scope.selectedName = null;

$scope.selectKid = function(){
  $scope.selectedName = this.kid.name;
};
//***********************************//
//        User Reserve Event         //
//***********************************//
$scope.reserve = function(date, jsEvent, view) {
  var childRefNumber = this.slots.slice(-1);
  var userId = authData.uid;
  var firebaseRef = new Firebase("https://momsmorningscheduler.firebaseio.com");
  var eventKey = $scope.selectedDateKey;
  var selectedName = $scope.selectedName;
  firebaseRef.on('value', function (snapshots) {
    var selectedEvent, userKey;
    snapshots.forEach(function (snapshot) {
      if ( snapshot.key() == 'events' ) {
        selectedEvent = snapshot.val()[eventKey];
        selectedEvent.key = eventKey;
      } else if ( snapshot.key() == 'users' ) {
        var users = snapshot.val();

        Object.keys(users).forEach(function(key) {
          if ( users[key].id == userId ) {
            userKey = key;
          }
        });
      } else {
        console.log('some other table');
      }
    });
    var updateResRef = new Firebase("https://momsmorningscheduler.firebaseio.com/events/" + selectedEvent.key + "/reservations/" + childRefNumber);
    updateResRef.update({"user_id": userKey, "childName": selectedName});
    });
    //Remove slot from array after selection
    $scope.showAvailableSlots.splice(this.$index, 1);
  };


      //Values for time selector on admin page
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

    }]);//End of Calendar Controller


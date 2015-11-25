app.controller('calendarController', ['$scope', '$firebase', '$firebaseArray', '$location', '$compile', '$timeout', 'uiCalendarConfig','$rootScope','userService', 'authService', function($scope, $firebase, $firebaseArray, $location, $compile, $timeout, uiCalendarConfig, $rootScope, userService, authService) {

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
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
//  Firebase eventsTestReference     //
//***********************************//
var eventsTestRef = new Firebase("https://momsmorningscheduler.firebaseio.com/eventsTest");


//***********************************//
//  Admin submit date to database    //
//***********************************//
$scope.addEventToDatabase = function(date, jsEvent, view) {
  var payloadStringified = JSON.stringify($scope.payload);
  var payloadParsed = JSON.parse(payloadStringified);

  var newStartDateTime = (userService.currentDate + ' ' + $scope.selectedStartHour + ':' + $scope.selectedStartMinute + ' ' + $scope.selectedStartampm).toString();
  var newEndDateTime = (userService.currentDate + ' ' + $scope.selectedEndHour + ':' + $scope.selectedEndMinute + ' ' + $scope.selectedEndampm).toString();

  var formData = {
    title: 'Morning Session',
    start: newStartDateTime,
    end: newEndDateTime,
    reservations:{0:{user_id: '', age:'0-24 months'},1:{user_id: '', age:'0-24 months'},2:{user_id: '', age:'2-6 years'},3:{user_id: '', age:'2-6 years'},4:{user_id: '', age:'2-6 years'},5:{user_id: '', age:'2-6 years'}}
  };
  eventsTestRef.push(formData);
};


//$scope.events and $scope.eventSources are
//necessary for UI Calendar to read events
$scope.events = [];
$scope.eventSources = [$scope.events];

//***********************************//
//     Call Database for events      //
//***********************************//
$scope.callBack = function(){
  eventsTestRef.on("value", function(snapshot) {
    $scope.events.splice(0);
    firebaseEvents = snapshot.exportVal();
    var counter = 0;
    //loop through events to get num of reserved events
    for(var key in firebaseEvents){
      var clientSideEvent  = firebaseEvents[key];
      clientSideEvent.key = key;
      //break into client events object
      for (var key2 in clientSideEvent.reservations){
              if(clientSideEvent.reservations[key2].user_id !== ""){
                //count num of reserved slots for each event
                counter += 1;
              }
            }
            if(counter === 4 ){
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

$scope.cats = function(){
  console.log('cats');
};

//***********************************//
//   Show event details on click     //
//***********************************//
    $scope.alertOnEventClick = function(date, jsEvent, view){
      var showAvailableSlots = [];
      for(var key in date.reservations){
          // console.log(date.reservations[key].user_id, ' key and user_id');
          if(date.reservations[key].user_id === ""){
            showAvailableSlots.push(date.reservations[key].age);
            console.log(showAvailableSlots, ' show available');
          }
          if(showAvailableSlots.length >= 2){
            $scope.alertMessage = ('You chose a ' + date.title + ' on ' + date.start.format('MM/DD/YYYY'));
          } else {
           $scope.alertMessage = ('This date is already full. Please choose another');
         }
         $scope.date = date;
       }
       $scope.cleanDate = moment(date.start).format('DD/MM/YYYY');
       $scope.selectedDateKey = date.key;
     };

    // $scope.alertOnEventClick = function(date, jsEvent, view){
    //   var showAvailSlots = [];
    //   for(var key in date.reservations){
    //       // console.log(date.reservations[key].user_id, ' key and user_id');
    //       if(date.reservations[key].user_id !== ""){
    //         showAvailSlots.push(date.reservations[key].user_id);
    //       }
    //       if(showAvailSlots.length < 4){
    //         $scope.alertMessage = ('You chose a ' + date.title + ' on ' + date.start.format('MM/DD/YYYY'));
    //       } else {
    //        $scope.alertMessage = ('This date is already full. Please choose another');
    //      }
    //      $scope.date = date;
    //    }
    //    $scope.cleanDate = moment(date.start).format('DD/MM/YYYY');
    //    $scope.selectedDateKey = date.key;
    //  };


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
    /* Change View */
    $scope.renderCalender = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };

    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
      element.attr({'tooltip': event.title,
        'tooltip-append-to-body': true});
      $compile(element)($scope);
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

      // $scope.eventSource is
      // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
      // init();

//////////////////////// USER CALENDAR FUNCTIONALITY BEGINS BELOW ////////////////////////
$scope.reserve = function(date, jsEvent, view) {
  var userId = authData.uid;
  var firebaseRef = new Firebase("https://momsmorningscheduler.firebaseio.com");
  var eventKey = $scope.selectedDateKey;
  var determineReserve = [];

  //Determine if date is full, disallow user to schedule
  for(var key in $scope.date.reservations){
    if($scope.date.reservations[key].user_id !== ""){
      determineReserve.push($scope.date.reservations[key].user_id);
      console.log(determineReserve, ' determine');
    }
  }
  if(determineReserve.length < 4){
    firebaseRef.on('value', function (snapshots) {
      var selectedEvent, userKey;
      snapshots.forEach(function (snapshot) {
        if ( snapshot.key() == 'eventsTest' ) {
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

      var updateResRef = new Firebase("https://momsmorningscheduler.firebaseio.com/eventsTest/" + selectedEvent.key + "/reservations");
      updateResRef.child('1').update({user_id: userKey });

      console.log('event and key', selectedEvent, userKey);
    });
  } else{
    console.log('Date is full, please choose another');
    $scope.alertMessage = ('Date is full, please select another');
  }
};

$scope.show0to24Months = function(){

};

$scope.show2to6Years = function(){

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


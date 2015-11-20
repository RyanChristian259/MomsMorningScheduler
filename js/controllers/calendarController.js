<<<<<<< HEAD
app.controller('calendarController',
 function($scope, $firebase, $firebaseArray, $location, $compile, $timeout, uiCalendarConfig, $rootScope,userService) {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
=======
app.controller('calendarController', ['$scope', '$location', '$firebase', '$firebaseArray', '$rootScope','userService', function($scope, $location, $firebase, $firebaseArray, $rootScope,userService) {


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
>>>>>>> 1ba7a6b08f461d365c3654380645dbdd3ce763bd


  var payload = {};
  $scope.payload = payload;
  window.cal = uiCalendarConfig;

//***********************************//
//        Firebase reference         //
//***********************************//
var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/events");


//***********************************//
//  Admin submit date to database    //
//***********************************//
$scope.addEventToDatabase = function(date, jsEvent, view) {
  var payloadStringified = JSON.stringify($scope.payload);
  var payloadParsed = JSON.parse(payloadStringified);

  var newStartDateTime = new Date(y, m, d + 0, $scope.selectedStartHour, $scope.selectedStartMinute).toString();
  var newEndDateTime = new Date(y, m, d + 0, $scope.selectedEndHour, $scope.selectedEndMinute).toString();
  var formData = {
    title: 'Morning Session',
    start: newStartDateTime,
    end: newEndDateTime,
    reservations: { 0: { user_id: '' },
                    1: { user_id: '' },
                    2: { user_id: '' },
                    3: { user_id: '' } }
  };
  ref.push(formData);
<<<<<<< HEAD
      //Firebase callback starts here
      var inEvents;
      ref.on("value", function(snapshot) {
        events = snapshot.exportVal();
        for(var key in events){
          inEvents = events[key];
        }
        $scope.events.push({
         title: inEvents.title,
         start: inEvents.start,
         end: inEvents.end,
         reservations: inEvents.reservations
       });
=======
};


//***************************//
//  Async call to firebase   //
//***************************//
// var ref = new Firebase("https://momsmorningscheduler.firebaseio.com");
// // Attach an asynchronous callback to read the data at our posts reference
// ref.on("value", function(snapshot) {
//   console.log(snapshot.exportVal());

// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });


$scope.getData = function() {
  queryArray = [];
  var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/events");

  ref.orderByChild('date/time').on("child_added", function(snapshot) {

   var query = snapshot.exportVal();

   var pushedQuery = queryArray.push(query);
      // console.log(query);

    });
  $scope.query = queryArray;

  console.log(userService.appointmentService,' in the getData');
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
  console.log(data)

    // var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/events");

    // ref.orderByChild("date/schedule/time").equalTo("2015-11-13T19:24:21.465Z").on('childAdded', function (snapshot) {
    //    console.log(snapshot.key());
    // });
>>>>>>> 1ba7a6b08f461d365c3654380645dbdd3ce763bd

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
      console.log(userService.currentUserID, ' here is the users id');
    };

    $scope.events = [];
    $scope.eventSources = [$scope.events];
    // console.log($scope.events, $scope.eventSources);
    $scope.callBack = function(){
      ref.on("value", function(snapshot) {
        $scope.events.splice(0);
        firebaseEvents = snapshot.exportVal();

        console.log('firebaseEvents', firebaseEvents);



        for(var key in firebaseEvents){
          var clientSideEvent     = firebaseEvents[key];
              clientSideEvent.key = key;

          $scope.events.push(clientSideEvent);
        }

<<<<<<< HEAD
        $scope.$apply();
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    };

    var init = function(){
      $scope.callBack();
    };

    // Call init to populate calendar on page load
    init();


    /* event source that contains custom events on the scope */
          // $scope.events = [
          // {title: 'All Day Event and cats',start: new Date(2015, 10, 2)},
          // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false}
          // ];
          /* event source that calls a function on every view switch */
          /* alert on eventClick */

    // $scope.renderSingleDate = function(){

    // };
    $scope.alertOnEventClick = function(date, jsEvent, view){
      $scope.alertMessage = (date.title + ' was clicked ' + date.start);
      $scope.cleanDate = moment(date.start).format('DD/MM/YYYY');
      $scope.selectedDateKey = date.key;
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

   $scope.changeTo = 'Hungarian';

      /* remove event */
      $scope.remove = function(index) {
        $scope.events.splice(index,1);
      };
      /* Change View */
      $scope.changeView = function(view,calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
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
          editable: true,
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

      $scope.changeLang = function() {
        if($scope.changeTo === 'Hungarian'){
          $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
          $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
          $scope.changeTo= 'English';
        } else {
          $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          $scope.changeTo = 'Hungarian';
=======
  // $('span').on('click', function(){
  //   var buttonClicked = $(this).html();
  //   console.log(buttonClicked, ' click');
  // });

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
        // console.log(key, " key");
      var childData = childSnapshot.val();
      // console.log(childData, ' key');
      var ref2 = new Firebase("https://momsmorningscheduler.firebaseio.com/events/" + key + '/slots');
      ref2.on('value',function(snapshot){

         if (dateChosen === childData.date) {
          userService.appointmentService = snapshot.val();
          console.log(userService.appointmentService,'inside the if');
          // console.log(snapshot.val(),' dateChosen');
          // ref2.update({
          //   1: false
          // });
      }

      });




    });

  events2 = snapshot.exportVal();
  // console.log(events2);
  // for(var key in events2){

  //    inEvents = events2[key];

     // if (dateChosen === inEvents.date) {
     //  console.log(inEvents);
     //  console.log(inEvents.date);
     //  console.log( 'wah-hoo');
     // }
  // }

  $rootScope.events2 = events2;
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
};

var ref3 = new Firebase("https://momsmorningscheduler.firebaseio.com/workDays");
ref3.orderByChild("workDays/date").on("child_added", function(snapshot) {
  console.log('status ' + snapshot.key() + ' ' + snapshot.val().status + " date " + snapshot.val().date);
});

// var ref2 = new Firebase("https://dinosaur-facts.firebaseio.com/dinosaurs");
// ref2.orderByChild("dimensions/height").on("child_added", function(snapshot) {
//   console.log(snapshot.key() + " was " + snapshot.val().height + " meters tall");
// });

//***********************************************//
// process events to show if slots are available //
//***********************************************//
$scope.processEvents = function(events){
  var numSlots = 0;
  for (var i = 0; i < $scope.events.length; i ++){
    for (var j = 0; j < $scope.events.length; j ++){
      if( $scope.events[i].slots[j] === false){
        numSlots += 1;
      }
    }
    return numSlots;
  }
};


//*************************//
// Show events on calendar //
//*************************//
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
>>>>>>> 1ba7a6b08f461d365c3654380645dbdd3ce763bd
        }
      };
      /* event sources array*/

      // $scope.events is your events with the following keys:
      // title, start, end, allDay

      // $scope.eventSource is
      // $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
      // init();

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

//////////////////////// USER CALENDAR FUNCTIONALITY BEGINS BELOW ////////////////////////
  $scope.reserve = function() {
    var userId = userService.currentUserID;
    var firebaseRef = new Firebase("https://momsmorningscheduler.firebaseio.com");
    var eventKey = $scope.selectedDateKey;


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

      // selectedEvent = { end: ..., start: ..., title: ...,
      //                   reservations: [{ 0: '' }, { 1: '' }, { 2: '' }, { 3: '' }] }
      // userKey = -KsEHUnjdkscaheHUEFjhds
      //
      // What you want is:
      // >> reservations: [{ 0: '-KsEHUnjdkscaheHUEFjhds', ... }]
      var updateResRef = new Firebase("https://momsmorningscheduler.firebaseio.com/events/" + selectedEvent.key + "/reservations");
      updateResRef.child('1').update({user_id: userKey });

      console.log('event and key', selectedEvent, userKey);
    });

    // userRef.on("value", function(users) {

    //   users.forEach(function(user){
    //     key = user.key();
    //     userData = user.val();
    //   });

    //   if(userId === userData.id){
    //     var singleUserRef = new Firebase("https://momsmorningscheduler.firebaseio.com/users/" + key);
    //     singleUserRef.update({'date':$scope.cleanDate});
    //   }
    // }, function (errorObject) {
    //   console.log("The read failed: " + errorObject.code);
    // });
  };

// usersRef.update({
//   "alanisawesome/nickname": "Alan The Machine"
//   "gracehop/nickname": "Amazing Grace"
// });


});//End of Calendar Controller

app.controller('calendarController',
 function($scope, $firebase, $firebaseArray, $location, $compile, $timeout, uiCalendarConfig, $rootScope, userService) {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();


  var payload = {};
  $scope.payload = payload;
  window.cal = uiCalendarConfig;

//***********************************//
//        Firebase reference         //
//***********************************//
var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/eventsTest");


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
    reservations:{0:{value: ''},1:{value: ''},2:{value: ''},3:{value: ''}}
  };
  ref.push(formData);
      //Firebase callback starts here
      var inEvents;
      ref.on("value", function(snapshot) {
        events = snapshot.exportVal();
        for(var key in events){
          inEvents = events[key];
        }
        // $scope.events.push({
         // title: inEvents.title,
         // start: inEvents.start,
         // end: inEvents.end
       // });

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    };

    $scope.events = [];
    $scope.eventSources = [$scope.events];
    console.log($scope.events, $scope.eventSources);
    $scope.callBack = function(){
      ref.on("value", function(snapshot) {
        $scope.events.splice(0);
        events = snapshot.exportVal();

        for(var key in events){
          $scope.events.push(events[key]);
        }

        $scope.$apply();
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    };
    var init = function(){
      $scope.callBack();
    };

    // Call init to populate calendar on page load
    // Must be called after admin submit function
    init();


    /* event source that contains custom events on the scope */
          // $scope.events = [
          // {title: 'All Day Event and cats',start: new Date(2015, 10, 2)},
          // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false}
          // ];
          /* event source that calls a function on every view switch */


    $scope.alertOnEventClick = function( date, jsEvent, view){
      $scope.alertMessage = (date.title + ' was clicked ' + date.start);
      $scope.dateTest = date.start;
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
        /* event source that pulls from google.com */


        /* add custom event*/
      // $scope.addEvent = function() {
      //   $scope.events.push({
      //     title: 'Open Sesame',
      //     start: new Date(y, m, 28),
      //     end: new Date(y, m, 29),
      //     className: ['openSesame']
      //   });
      // };
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

    });//End of Calendar Controller

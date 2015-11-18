 app.controller('CalendarCtrl',
   function($scope, $firebase, $firebaseArray, $location, $compile, $timeout, uiCalendarConfig, $rootScope) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    var payload = {};
    $scope.payload = payload;

    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/eventsTest");

 // $scope.alertOnEventClick = function( date, jsEvent, view){
 //          $scope.alertMessage = (date.title + ' was clicked ' + date.start);
 //          console.log(date, ' date', jsEvent, ' jsEvent', view, ' view')
 //        };

    $scope.addEventToDatabase = function(date, jsEvent, view) {
      var payloadStringified = JSON.stringify($scope.payload);
      var payloadParsed = JSON.parse(payloadStringified);

      var newStartDateTime = new Date(y, m, d + 0, $scope.selectedStartHour, $scope.selectedStartMinute).toString();
      var newEndDateTime = new Date(y, m, d + 0, $scope.selectedEndHour, $scope.selectedEndMinute).toString();
      var formData = {
        title: 'Morning Session',
        start: newStartDateTime,
        end: newEndDateTime,
      };
      console.log(formData, ' form data');
      console.log('Data Sent');
      ref.push(formData);
      //where callback starts
      var inEvents;
      ref.on("value", function(snapshot) {
        events = snapshot.exportVal();
        for(var key in events){
          inEvents = events[key];
        }
        $scope.events.push({
          title: inEvents.title,
          start: inEvents.start,
          end: inEvents.end
        });
        console.log($scope.dateTest, ' date test');
        console.log($scope.events, ' scope.events');
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    };

    $scope.callBack = function(){
      var inEvents;
      ref.on("value", function(snapshot) {
        events = snapshot.exportVal();
        for(var key in events){
          inEvents = events[key];
        }
        $scope.events.push({
          title: inEvents.title,
          start: inEvents.start,
          end: inEvents.end
        });
        console.log($scope.events, ' scope.events');
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    };

    $scope.eventSource = {
      url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
          };
          /* event source that contains custom events on the scope */
          $scope.events = [
          {title: 'All Day Event and cats',start: new Date(2015, 10, 2)},
          // {title: 'Morning Out',start: new Date(y, m, 3 + 0, 08, 30)}
          // {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
          // {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
          // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false}
          ];
          /* event source that calls a function on every view switch */
          $scope.eventsF = function (start, end, timezone, callback) {
            var s = new Date(start).getTime() / 1000;
            var e = new Date(end).getTime() / 1000;
            var m = new Date(start).getMonth();
            var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
            callback(events);
          };

          $scope.calEventsExt = {
           color: '#f00',
           textColor: 'yellow',
           events: [
           {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
           {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
           {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
           ]
         };
         /* alert on eventClick */
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
      $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
      $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];


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

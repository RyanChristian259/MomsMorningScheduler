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


//Set Max Date for Scheduling availibility--
//Change the num after .getFullYear to adjust
     var setMaxDateYear = new Date().getFullYear() + 1;
     var setMaxDateMonth = new Date().getMonth() + 12;
    $scope.maxDate = new Date(setMaxDateYear, setMaxDateMonth, 1);
    console.log($scope.maxDate);


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
    console.log(cleanDate);
    var payload = {
      'timeStamp': cleanDate
    };


    $scope.payload = payload;
    console.log($scope.payload);
  };

  $scope.submitDate = function() {

    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");
    var workDaysCollection = ref.child("workDays");
    var payloadStringified = JSON.stringify($scope.payload);
    var payloadParsed = JSON.parse(payloadStringified);
    workDaysCollection.push(payloadParsed);
  };




  $scope.formSubmit = function() {
    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/workDays");

    // var payloadStringified = JSON.stringify($scope.payload);

    // var payloadParsed = JSON.parse(payloadStringified);

    var formData = {
      date: {
        time: $scope.payload.timeStamp,
        schedule: $scope.formData,
        slots:{1:false,2:false,3:false,4:false}
      }
    };
    ref.push(formData);

  };


  $scope.getData = function() {
    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com");
    queryArray = [];

    ref.orderByChild('date/time').on("child_added", function(snapshot) {

       var query = snapshot.exportVal();

       var pushedQuery = queryArray.push(query);
      console.log(query);

    });


    $scope.query = queryArray;
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



}]);


// app.controller('DatepickerDemoCtrl', function ($scope) {
//   $scope.today = function() {
//     $scope.dt = new Date();
//   };
//   $scope.today();

//   $scope.clear = function () {
//     $scope.dt = null;
//   };

//   // Disable weekend selection
//   $scope.disabled = function(date, mode) {
//     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
//   };

//   $scope.toggleMin = function() {
//     $scope.minDate = $scope.minDate ? null : new Date();
//   };
//   $scope.toggleMin();
//   $scope.maxDate = new Date(2020, 5, 22);

//   $scope.open = function($event) {
//     $scope.status.opened = true;
//   };

//   $scope.setDate = function(year, month, day) {
//     $scope.dt = new Date(year, month, day);
//   };

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

//   $scope.getDayClass = function(date, mode) {
//     if (mode === 'day') {
//       var dayToCheck = new Date(date).setHours(0,0,0,0);

//       for (var i=0;i<$scope.events.length;i++){
//         var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

//         if (dayToCheck === currentDay) {
//           return $scope.events[i].status;
//         }
//       }
//     }

//     return '';
//   };
// });

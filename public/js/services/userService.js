//Service for User Service
app.service('userService', ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {

    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");

    var currentUserID = 'nothing yet sucka';

    var currentUserKey = 'nothing yet sucka';

    var appointmentService = 'nothing yet';

    var currentDate = 'No Date';

    var userKids = 'no kids yet';

}]); //end Service

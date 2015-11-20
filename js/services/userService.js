//Factory for User Service
app.service('userService', ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {
    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");

    var currentUserID = 'nothing yet sucka';
<<<<<<< HEAD
    var currentUserEmail = 'nada much';
=======
    var appointmentService = 'nothing yet';
>>>>>>> 1ba7a6b08f461d365c3654380645dbdd3ce763bd


}]); //end factory


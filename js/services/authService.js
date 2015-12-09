//Service for Auth Service - see Auth Controller
app.factory('authService', ['$q', '$timeout', '$http',
  function($q, $timeout, $http) {

    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");

    var usersCollection = ref.child("users");

    function isLoggedIn(authData) {
      authData = ref.getAuth();
      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      return true;
      } else {
        return false;
      }
      console.log('hit');


      // if (authData) {
      //   console.log('getting in the conditional');
      //   return true;
      // } else {
      //   return false;
      // }
    }
    // isLoggedIn();
    return ({
      isLoggedIn: isLoggedIn,

    });
  }]); // end service



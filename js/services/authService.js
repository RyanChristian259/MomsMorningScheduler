//Factory for Auth Service - see Auth Controller
app.factory('AuthService', ['userService','$q', '$timeout', '$http',
  function(userService,$q, $timeout, $http) {
    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");

    var usersCollection = ref.child("users");



    // var authData = ref.getAuth();
    // if (authData) {
    //   console.log("Authenticated user with uid:", authData.uid);
    //   return authData;
    // }


    function isLoggedIn(authData) {
      authData = ref.getAuth();
      if (authData) {
        userService.currentUserID = authData.uid;
        userService.currentUserEmail = authData.password.email;
        return true;
      } else {
        return false;
      }

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
  }
]);

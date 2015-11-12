var app = angular.module('scheduleApp', ['firebase', 'ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap']);


app.controller('mainController', ['$scope', '$http', '$location', '$firebase', '$route', '$routeParams', '$firebaseArray', function($scope, $http, $location, $firebase, $route, $routeParams, $firebaseArray) {

  moment().format();
  var self = this;

  var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");

  var usersCollection = ref.child("users");


  //Create user with Firebase
  $scope.createUser = function() {
    usersCollection.createUser({
        email: $scope.createEmail,
        password: $scope.createPassword
      },

      function(error, userData) {
        if (error) {
          console.log("Error YO:", error);
        } else {
          console.log("Successfully created user account with uid:", userData);
        }
      });
    // auth.$createUser($scope.createEmail, $scope.createPassword).then(function() {
    //   console.log("User created successfully!");
    // }).catch(function(error) {
    //   console.log("Error:", error);
    // });
  };



  //User sign in with Firebase
  $scope.signInUser = function() {
    ref.authWithPassword({
      email: $scope.enterEmail,
      password: $scope.enterPassword
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }

    });
  };

  //User change password with Firebase
  $scope.changePassword = function() {
    ref.changePassword({
      email: $scope.enterCurrentEmail,
      oldPassword: $scope.enterOldPassword,
      newPassword: $scope.enterNewPassword
    }, function(error) {
      if (error === null) {
        var message = 'Password Changed Successfully';
        console.log("Password changed successfully");
      } else {
        console.log("Error changing password:", error);
      }
    });
  };

  //Update email address
  $scope.updateEmail = function() {
    ref.changeEmail({
      oldEmail: $scope.oldEmail,
      newEmail: $scope.newEmail,
      password: $scope.password
    }, function(error) {
      if (error === null) {
        console.log("Email changed successfully");
      } else {
        console.log("Error changing email:", error);
      }
    });
  };

  //Reset password via email
  $scope.passwordReset = function() {
    ref.resetPassword({
      email: $scope.passwordResetEmail
    }, function(error) {
      if (error === null) {
        console.log("Password reset email sent successfully");
      } else {
        console.log("Error sending password reset email:", error);
      }
    });
  };

  $scope.deleteUser = function() {
    var confirmDelete = confirm('Are you sure? This cannot be undone.');
    if (confirmDelete === true) {
      ref.removeUser({
        email: $scope.deleteUserEmail,
        password: $scope.deleteUserPassword
      }, function(error) {
        if (error === null) {
          console.log("User removed successfully");
        } else {
          console.log("Error removing user:", error);
        }
      });
    } else {
      console.log('deleteUser cancelled')
    }
  };

  // $scope.logoutUser = function() {
  //   ref.unauth(function(error, authData) {
  //     if (error) {
  //       console.log("Login Failed!", error);
  //     } else {
  //       console.log("Authenticated successfully with payload:", authData);
  //     }

  //   });
  // };



}]);


app.controller('amberController', ['$scope', '$location', '$firebase', '$firebaseArray', function($scope, $location, $firebase, $firebaseArray) {
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
    $scope.maxDate = new Date(2020, 5, 22);

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
    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com").limitToFirst(1);
    queryArray = [];

    ref.orderByKey().on("child_added", function(snapshot) {

       var query = snapshot.exportVal();

       queryArray.push(query);

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

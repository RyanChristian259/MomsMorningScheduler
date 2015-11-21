app.controller('authController', ['$scope', '$http', '$location', '$firebase', '$route', '$routeParams', '$firebaseArray', 'userService', function($scope, $http, $location, $firebase, $route, $routeParams, $firebaseArray, userService) {

  var self = this;

  var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");

  var usersCollection = ref.child("users");

  $scope.success = false;

//*******************************//
//          Sign In User         //
//*******************************//
  $scope.signInUser = function() {
    ref.authWithPassword({
      email: $scope.enterEmail,
      password: $scope.enterPassword
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        userService.currentUserID = authData.uid;
        $scope.success = true;
        //not sure if this returns if you are logged in or out!!! Pls confirm.
        console.log(userService.currentUserID, ' userservice current id, coming from sign in');
        $scope.message = 'You are logged in!';
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  };


ref.authWithPassword({
  email    : "bobtony@firebase.com",
  password : "correcthorsebatterystaple"
}, function(error, authData) { /* Your Code */ }, {
  remember: "sessionOnly"
});

//*******************************//
//          Create User          //
//*******************************//
  $scope.createUser = function() {
    usersCollection.createUser({
      email: $scope.createEmail,
      password: $scope.createPassword
    },
    function(error, userData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Successfully created user account with uid:", userData);
      }
        //login user after account creation
        ref.authWithPassword({
          email: $scope.createEmail,
          password: $scope.createPassword
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/users");
            var formData = {
              email: authData.password.email,
              id: authData.uid
            };
            userService.currentUserID = authData.uid;
            ref.push(formData);
          }
        });
      });
};

//*******************************//
//         Change Password       //
//*******************************//
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

//*******************************//
//      Update Email address     //
//*******************************//
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

//************************************//
//  Request password reset via email  //
//************************************//
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

//*******************************//
//          Delete User         //
//*******************************//
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
      console.log('deleteUser cancelled');
    }
  };

//*******************************//
//            Logout             //
//*******************************//
  $scope.logoutUser = function() {
    ref.unauth(function(error, authData) {
      if (error) {
        console.log("Logout Failed!", error);
      } else {
        console.log("You are logged out");
      }

    });
  };

}]);


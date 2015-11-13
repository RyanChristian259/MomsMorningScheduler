app.controller('authController', ['$scope', '$http', '$location', '$firebase', '$route', '$routeParams', '$firebaseArray', function($scope, $http, $location, $firebase, $route, $routeParams, $firebaseArray) {

  var self = this;

  var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");

  var usersCollection = ref.child("users");

  $scope.success = false;

  //User sign in with Firebase
  $scope.signInUser = function() {
    ref.authWithPassword({
      email: $scope.enterEmail,
      password: $scope.enterPassword
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        $scope.success = true;
        $scope.message = 'You are logged out!';
        console.log("Authenticated successfully with payload:", authData);

      }

    });
  };


  // Create user with Firebase
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
        //login user after account creation
        ref.authWithPassword({
          email: $scope.createEmail,
          password: $scope.createPassword
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
          }
        });
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
      console.log('deleteUser cancelled');
    }
  };

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


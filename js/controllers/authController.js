app.controller('authController', ['$scope', '$http', '$location', '$firebase', '$route', '$routeParams', '$firebaseArray', 'userService', 'authService', '$window', function($scope, $http, $location, $firebase, $route, $routeParams, $firebaseArray, userService, authService, $window) {

  var self = this;

  var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/");

  var usersCollection = ref.child("users");

//***********************************//
//         Check Login State         //
//***********************************//
var authData = ref.getAuth();
if (authData) {
  console.log("User " + authData.uid + " is logged in with auth controller " + authData.provider);
  $scope.authData = authData;
  $scope.greetUser = authData.password.email;
  // console.log(' auth data ', authData);
} else {
  console.log("User is logged out");
}

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
        //not sure if this returns if you are logged in or out!!! Pls confirm.
        $scope.message = 'You are logged in!';
        console.log("Authenticated successfully with payload:", authData);
        $location.path('#/');
        $window.location.reload();
      }
    });
};

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
              id: authData.uid,
              children: []
            };
            userService.currentUserID = authData.uid;
            ref.push(formData);
            $location.path('#/');
            $window.location.reload();
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
      $window.location.reload();
    }

  });
};

//*******************************//
//         User Populate         //
//*******************************//
$scope.updateUser = function() {
    console.log(authData.uid, ' auth.uid populate');
    var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/" + authData.uid);
    // var formData = {
    //     firstName: $scope.userFirstname,
    //     lastName: $scope.userLastName
    //     };
    //    // userService.currentUserID = authData.uid;
    //    ref.push(formData);


  //   var usersRef = ref.child("users");
  //   usersRef.set({
  //     alanisawesome: {
  //       date_of_birth: "June 23, 1912",
  //       full_name: "Alan Turing"
  //     },
  //     gracehop: {
  //       date_of_birth: "December 9, 1906",
  //       full_name: "Grace Hopper"
  //     }
  // });
};

// var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/events");
//   ref.on("value", function(snapshot) {
//     snapshot.forEach(function (childSnapshot){
//       var key = childSnapshot.key();
//         console.log(key, " key");
//       var childData = childSnapshot.val();
//       console.log(childData, ' key')
//        if (dateChosen === childData.date) {
//           var ref2 = new Firebase("https://momsmorningscheduler.firebaseio.com/events/" + key + '/slots');
//           ref2.update({
//             0: true
//           });
//       }



//*******************************//
//    add children to user       //
//*******************************//



  $scope.child = {};
  $scope.addKid = function () {
     var ref = new Firebase("https://momsmorningscheduler.firebaseio.com/users");
     var key = '';
     var childData = $scope.child;
     ref.on("value", function(snapshot) {
      // console.log(snapshot.val(), ' snappie');
        snapshot.forEach(function (childSnapshot) {
        // console.log(childSnapshot.val(), 'users');
          if (authData.uid === childSnapshot.val().id) {
            // console.log('yay!')
            key = childSnapshot.key();
            userService.currentUserKey = key;
            pushIntoUser();
          }
        });
        // var userRef = new Firebase('https://momsmorningscheduler.firebaseio.com/users/' + key + '/children');
          // userRef.push(childData);
     });

  };
  var pushIntoUser = function () {
    var key = userService.currentUserKey;
    console.log(key);
    var userRef = new Firebase('https://momsmorningscheduler.firebaseio.com/users/' + key + '/children');
    // var data = {
    //   name: $scope.child.name,
    //   birthdate: $scope.child.birthdate
    // };
    // var newChildRef = userRef.push();
    // newChildRef.set({
    //   name: $scope.child.name,
    //   birthdate: $scope.child.birthdate
    // });
    userRef.push({
      name: $scope.child.name,
      birthdate: $scope.child.birthdate,
      time: Firebase.ServerValue.TIMESTAMP
    });
    // console.log(data);
    // userRef.push(data);
  };

// var postsRef = ref.child("posts");
//   var newPostRef = postsRef.push();
//   newPostRef.set({
//     author: "gracehop",
//     title: "Announcing COBOL, a New Programming Language"
//   });
//   // we can also chain the two calls together
//   postsRef.push().set({
//     author: "alanisawesome",
//     title: "The Turing Machine"
//   });
}]);


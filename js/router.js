app.config(function ($routeProvider) {
 $routeProvider

    .when('/', {
     templateUrl: 'pages/home.html',
     controller:'calendarController',
     access: {restricted: true}
   })

   .when('/login', {
     templateUrl: 'pages/auth/login.html',
     controller:'authController',
   })

    .when('/signup', {
     templateUrl: 'pages/auth/signUp.html',
     controller:'authController',
     access: {restricted: true}
   })

     .when('/updateinfo', {
     templateUrl: 'pages/auth/updateEmailAndPass.html',
     controller:'authController',
   })

       .when('/resetpassword', {
     templateUrl: 'pages/auth/resetpassword.html',
     controller:'authController',
   })

   .when('/deleteaccount', {
     templateUrl: 'pages/auth/deleteAccount.html',
     controller:'authController',
   })

    .when('/admin', {
     templateUrl: 'pages/admin/admin.html',
     controller:'calendarController',
     access: {restricted: true}
   })

   .otherwise({redirectTo: '/'});
});

// app.run(function ($rootScope, $location, $route, AuthService) {
//   $rootScope.$on('$routeChangeStart', function (event, next, current) {
//     if (next.access.restricted && AuthService.isLoggedIn() === false) {

//       $location.path('/login');
//     }
//   });
// });


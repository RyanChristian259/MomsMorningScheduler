app.config(function ($routeProvider) {
 $routeProvider

    .when('/', {
     templateUrl: 'pages/home.html',
     controller:'amberController',
   })

   .when('/login', {
     templateUrl: 'pages/auth/login.html',
     controller:'mainController',
   })

    .when('/signup', {
     templateUrl: 'pages/auth/signUp.html',
     controller:'mainController',
   })

     .when('/updateinfo', {
     templateUrl: 'pages/auth/updateEmailAndPass.html',
     controller:'mainController',
   })

       .when('/resetpassword', {
     templateUrl: 'pages/auth/resetpassword.html',
     controller:'mainController',
   })

   .when('/deleteaccount', {
     templateUrl: 'pages/auth/deleteAccount.html',
     controller:'mainController',
   })

   .otherwise({redirectTo: '/'});
});




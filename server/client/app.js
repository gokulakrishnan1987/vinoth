'use strict';

angular.module('vinothApp', [   
    'ngRoute'
])
    .config(function($routeProvider) {
        $routeProvider
            .when('/signup', {
                templateUrl: 'bower_components/app/signup/signup.html',
                controller: 'SignupController'
            })                     
            .otherwise({
                redirectTo: '/signup'
            });

        //$locationProvider.html5Mode(true);
    });

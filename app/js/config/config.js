window.Matsi = angular.module("Matsi", [
    'matsi.controllers',
    'matsi.services',
    'matsi.directives',
    'ngAnimate',
    'ngMaterial',
    'ui.router'
]);
Matsi.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $rootScope) {
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'pages/home.html',
            controller: '',
            data: {
                access: 'public'
            }
        })
        .state('updateFellowProfile', {
            url: '/updateFellowProfile',
            templateUrl: 'pages/updateFellowProfile.html',
            controller: 'FellowController',

            data: {
                access: 'private',
                authorizedRoles: [false],
                authenticate: true
            }
        })
        .state('myProfile', {
            url: '/myProfile',
            templateUrl: 'pages/myProfile.html',
            controller: '',
            data: {
                access: 'private'
            }
        })
        .state('fellowProfile', {
            url: '/fellowProfile/:uid',
            templateUrl: 'pages/fellowProfile.html',
            controller: 'FellowController',
            data: {
                access: 'private'
            }
        })
        .state('fellows', {
            url: '/fellows',
            templateUrl: 'pages/fellows.html',
            controller: 'FellowController',
            data: {
                access: 'private'
            }
        })
        .state('editMentor', {
            url: '/editMentor',
            templateUrl: 'pages/editMentor.html',
            controller: 'MentorController',
            data: {
                access: 'private'
            }
        })
        .state('findOneMentor', {
            url: '/mentors/:uid',
            templateUrl: 'pages/viewMentor.html',
            controller: 'MentorController',
            data: {
                access: 'private'
            }
        })
        .state('findAllMentors', {
            url: '/mentors',
            templateUrl: 'pages/viewAllMentors.html',
            controller: 'MentorController',
            data: {
                access: 'private'
            }
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'pages/settings.html',
            controller: 'SettingsController',
            data: {
                access: 'private'
            }
        });
    $urlRouterProvider.otherwise("/");

}]);

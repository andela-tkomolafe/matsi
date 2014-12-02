angular.module("matsi.controllers", ['firebase', 'ngCookies'])
    .controller('HomeController', ['$rootScope', '$scope', '$mdSidenav', '$location', '$state', 'FellowService',
        function($rootScope, $scope, $mdSidenav, $location, $state, FellowService) {

        }
    ])
    .controller("FellowController", ['$rootScope', '$scope', '$cookies', 'FellowService', '$http', '$stateParams', 'MentorService',
        function($rootScope, $scope, $cookies, FellowService, $http, $stateParams, MentorService) {
            console.log($rootScope,"this is root");
            console.log($rootScope.currentUser,"this is val");
            var currentUserUid = $stateParams.uid || $rootScope.currentUser.uid;

            // if ($rootScope.currentUser) {
            //     $scope.fellowData = FellowService.readMyProfile($rootScope.currentUser.uid);
            // };

            $scope.getAllFellows = function() {
                $scope.allFellows = FellowService.readFellow();
            };

            $scope.getCurrentFellow = function() {
              console.log($stateParams.uid,'user_uid');
                $scope.fellowData = FellowService.readSingleFellow(currentUserUid);
                this.showMessageBox = true;
            };
            $scope.submitFellow = function() {
                FellowService.updateFellow($scope.fellowData, $rootScope.currentUser.uid);
            };
            $scope.showBox1 = function(){
                $scope.showMessageBox = false;
            };
            $scope.sendMail = function() {
                var paramsFellow = angular.copy($scope.fellowData);
                delete paramsFellow.$id;
                delete paramsFellow.$priority;

                console.log(paramsFellow, 'rackCity');
                $http.post('/mail/user/1', paramsFellow).success(function(r) {
                    console.log(r);
                });
                $scope.sendRequests();
            };
            
            $scope.sendRequests = function() {
                FellowService.regRequest($scope.fellowData);
            };
        }
    ])
    .controller("MainCtrl", ['$rootScope', '$scope', '$firebase', '$cookies', 'FellowService',
        function($rootScope, $scope, $firebase, $cookies, FellowService) {

        }
    ])
    .controller("MentorController", ['$rootScope', '$scope', '$cookies', 'MentorService', '$stateParams',
        function($rootScope, $scope, $cookies, MentorService, $stateParams) {
            // $stateParams.uid = "hello";
            $scope.mentorData = {};
            $scope.mentors = [];

            if ($rootScope.currentUser) {
                $scope.mentorData = MentorService.readMyProfile($rootScope.currentUser.uid);
            };
            $scope.mentors = MentorService.readMentor();
            $scope.OneMentorData = MentorService.readSingleMentor($stateParams.uid);
            //console.log($scope.FindOneMentor, 'fireeee');
            //$scope.FindOneMentor.$bindTo($scope, 'mentorData');
            $scope.submitMentor = function(data) {
                if (document.getElementById('Agree').checked) {
                    MentorService.updateMentor(data, $rootScope.currentUser.uid, function(error) {
                        if (error) {
                            alert('Hoops! Data not updated succesfully');
                        } else {
                            alert('Data updated successfully');
                        }
                    });
                } else {
                    alert('You must agree to the Terms')
                }
            };
        }
    ]);

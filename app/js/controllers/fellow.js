angular.module("matsi.controllers")
    .controller("FellowCtrl", ['$rootScope', '$scope', '$cookies', 'Fellow', '$http', '$stateParams', 'Mentor', 'MailService', '$mdDialog', '$mdToast', '$location', 'utils', '$timeout',
        function($rootScope, $scope, $cookies, Fellow, $http, $stateParams, Mentor, MailService, $mdDialog, $mdToast, $location, utils, $timeout) {
            // $scope.smarterer = function() {
            //     var code = $stateParams.code;
            //     $scope.code = code;
            // };


            //get code and redirect if current url is smarterer callback url
            if ($location.absUrl().toString().indexOf('fellows/?code=') > -1) {
                var code = $location.search().code;
                var param = {
                    code: code
                };
                var url = '/smarterer/code/';
                Fellow.backEndPost(url, param, function(res) {
                    var data = {
                        uid: $rootScope.currentUser.uid,
                        badges: res.badges
                    };
                    Fellow.update(data);
                });
            }

            //Smarterer & plum Checkbox
            $scope.check = false;
            $scope.plumCheck = false;
            $scope.toggleCheck = function(val) {
                if (val === "smarterer") {
                    $scope.check = !$scope.check;
                } else {
                    $scope.plumCheck = !$scope.plumCheck;
                }

            };

            // plum api integration
            $scope.plum = function() {
                var param = {
                    email: $scope.fellow.plumEmail,
                    fname: $scope.fellow.firstName,
                    lname: $scope.fellow.lastName
                };
                var url = '/plum/api/';
                Fellow.backEndPost(url, param, function(res) {
                    var data = {
                        uid: $scope.fellow.uid,
                        plumBadges: res.candidates[0].badges
                    };
                    Fellow.update(data);
                });
            };

            //Date picker
            $scope.today = function() {
                $scope.dt = new Date();
                var curr_date = $scope.dt.getDate();
                var curr_month = $scope.dt.getMonth();
                var curr_year = $scope.dt.getFullYear();
                $scope.dt = curr_year + curr_month + curr_date;
            };
            $scope.today();
            $scope.clear = function() {
                $scope.dt = null;
            };
            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
                setTimeout(function() {
                    $scope.opened = false;
                }, 10);
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[2];



            $scope.all = function() {
                $scope.fellows = Fellow.all();
            };

            $scope.findOne = function() {
                var uid = $rootScope.currentUser ? ($stateParams.uid || $rootScope.currentUser.uid) : $stateParams.uid;
                $scope.fellow = Fellow.findOne(uid);
                this.showMessageBox = true;
            };

            $scope.delete = function(fellowId) {
                Fellow.delete(fellowId);
            };

            $scope.update = function() {
                if ($rootScope.currentUser.uid === $scope.fellow.uid || $rootScope.currentUser.isAdmin) {
                    Fellow.update($scope.fellow, function(err) {
                        if (err !== null) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .title('Update error')
                                .content('An error occured,  try again later')
                                .ariaLabel('Password notification')
                                .ok('Okay!')

                            );
                        }
                        if ($scope.plumCheck) {
                            $scope.plum();
                        }
                        if ($scope.check) {
                            // request smarterer authorization
                            window.location.href = 'https://smarterer.com/oauth/authorize?client_id=b30a2803ffe34bc68a6fe7757b039468&callback_url=http%3A%2F%2Fmatsi.herokuapp.com%2Ffellows%2F';

                        } else {
                            $location.path('fellows/' + $rootScope.currentUser.uid);
                        }

                    });
                }
            };

            $scope.showBox = function() {
                $scope.showMessageBox = false;
            };

            $scope.mentorConstraints = function(ev) {
                Fellow.mentorConstraint($stateParams.uid, function(res, hasUnmentored) {
                    if (res) {
                        if (hasUnmentored) {
                            $scope.sendRequest();
                        } else {
                            utils.showAlert(ev, 'This fellow is already being mentored, please select a fellow that is not currently being mentored');
                        }
                    } else {
                        $scope.sendRequest();
                    }
                });
            };

            $scope.sendRequest = function() {
                $scope.fellow.reason = $scope.fellow.message;
                MailService.send(1, $scope.fellow);
                Fellow.request($scope.fellow);
            };
        }
    ]);

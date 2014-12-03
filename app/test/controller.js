describe('Testing 001', function(){
	var FellowService,
		scope,
		MentorService,
		$httpBackend,
		$stateParams,
		$location;
	beforeEach(module("Matsi"));
	beforeEach(inject(function($injector, $controller, $rootScope, $cookies, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			$cookies.rootRef = 'https://brilliant-heat-9512.firebaseio.com/';
			scope = $rootScope;
			// Point global var
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			//$location = _$location_;
			FellowService = $injector.get('FellowService');
			MentorService = $injector.get('MentorService');
		}));
	it('should be equal', function(){

		var fellowData = FellowService.readFellow();
		console.log(fellowData);
		expect(typeof fellowData).toEqual('object');
	});
	it('should exist', function(){
		var mentorData = MentorService.readMentor();
		expect(typeof mentorData).toEqual('object');
	});
	
	// var mentor = {
	// 	name: 'kenny',
	// 	email: 'kenny@yahoo.com',
	// 	uid: '872862926098'
	// };

	// it('should update a mentor', function(){
	// 	MentorService.updateMentor(mentor, mentor.uid);
	// 	expect(mentor.name).not.toBeUndefined();
	// 	expect(mentor.name).toEqual('kenny');
	// 	expect(mentor.email).toMatch(/*.\@\.*/);
	// });
});
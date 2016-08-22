'use strict';

(function() {

function SignupController($scope) {
  //start-non-standard
  //user = {};
  //errors = {};
  //submitted = false;
  //end-non-standard

  /*constructor(Auth, $location) {
    this.Auth = Auth;
    this.$location = $location;
  }*/

  $scope.register =function(form){
    this.submitted = true;

    console.log(form.$valid);

    if (form.$valid) {
      this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        customerId: this.user.customerId,
        ivyCPGRef: this.user.ivyCPGRef
      }
      )
      .then(() => {
        // Account created, redirect to home
        this.$location.path('/');
      })
      .catch(err => {
        err = err.data;
        this.errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });
      });
    }
    
  }
}

angular.module('vinothApp')
  .controller('SignupController', SignupController);
})();



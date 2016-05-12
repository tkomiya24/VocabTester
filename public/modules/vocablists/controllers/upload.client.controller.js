'use strict';

// Vocablists controller
angular.module('vocablists').
  controller('UploadController',
    ['$scope', 'Upload', '$timeout',
      function($scope, Upload, $timeout) {
        $scope.upload = function(file, errFiles) {
          $scope.f = file;
          $scope.errFile = errFiles && errFiles[0];
          if (file) {
            file.upload = Upload.upload({
              url: 'vocablists/upload',
              data: {file: file}
            });

            file.upload.then(
              function(response) {
                $timeout(function() {
                    file.result = response.data;
                  }
                );
              },
              function(response) {
                if (response.status > 0) {
                  $scope.errorMsg = response.status + ': ' + response.data;
                }
              },
              function(evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
              }
            );
          } else {
            alert('No file');
          }
        };
      }
]);

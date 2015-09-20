'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location','Authentication', 'Menus',
	function($scope, $location, Authentication, Menus) {
		$scope.authentication = Authentication;
		if (Authentication.user) {
			$location.path('/vocablists');
		}
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

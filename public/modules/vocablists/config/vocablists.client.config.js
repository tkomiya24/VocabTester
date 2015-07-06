'use strict';

// Configuring the Articles module
angular.module('vocablists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Vocablists', 'vocablists', 'dropdown', '/vocablists(/create)?');
		Menus.addSubMenuItem('topbar', 'vocablists', 'List Vocablists', 'vocablists');
		Menus.addSubMenuItem('topbar', 'vocablists', 'New Vocablist', 'vocablists/create');
	}
]);
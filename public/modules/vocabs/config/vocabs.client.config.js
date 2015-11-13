'use strict';

// Configuring the Articles module
angular.module('vocabs').run(['Menus',
	function(Menus) {
  // Set top bar menu items
  Menus.addMenuItem('topbar', 'Vocabs', 'vocabs', 'dropdown', '/vocabs(/create)?');
  Menus.addSubMenuItem('topbar', 'vocabs', 'List Vocabs', 'vocabs');
  Menus.addSubMenuItem('topbar', 'vocabs', 'New Vocab', 'vocabs/create');
	}
]);

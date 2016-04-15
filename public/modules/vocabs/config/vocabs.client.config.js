'use strict';

// Configuring the Articles module
angular.module('vocabs').run(['Menus',
  function(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Vocab', 'vocabs', 'dropdown', '/vocabs(/create)?');
    Menus.addSubMenuItem('topbar', 'vocabs', 'View all', 'vocabs');
  }
]);

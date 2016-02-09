function Fields(type, attrs = {}){
  'use strict';

  var field = document.createElement(type);

  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      field[attr] = attr;
    }
  }

return field;
}

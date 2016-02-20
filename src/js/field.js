function Field(type, attrs = {}, meta = {}) {
  'use strict';

  var field = document.createElement(type);

  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      field.setAttribute(attr, attrs[attr]);
    }
  }

  return field;
}

var Properties = function(fieldData) {
  'use strict';

  var properties = this,
    _utils = {};


  properties.order = {
    meta: ['label', 'description', 'roles'],
    attrs: ['required', 'name', 'class']
  };

  properties.roles = function() {
    let roles = {
      value: 1,
      type: 'checkbox'
    };

    roles.options = fieldData.meta.roles.map(function(elem) {
      elem.type = 'checkbox';
      return elem;
    });
  };


  // if field type is not checkbox, checkbox/radio group or select list, add max length
  if ($.inArray(fieldData.type, ['checkbox', 'select', 'checkbox-group', 'date', 'autocomplete']) === -1 && !fieldData.attrs.maxLength) {
    fieldData.attrs.maxLength = '';
    properties.order.attrs.push('maxLength');
  }

  // options need a field for value, label and checkbox to select
  if (fieldData.options) {
    let optionFields = fieldData.options.map(function(elem, index) {
      let option = {
        options: [],
        type: 'none'
      };
      for (var prop in elem) {
        if (elem.hasOwnProperty(prop)) {
          let field = {
            value: elem[prop],
            label: prop,
            name: 'option-' + prop
          };
          if ('selected' === prop) {
            field.type = 'checkbox';
          }
          option.options.push(field);
        }
      }
      return option;
    });

    fieldData.options = {
      options: optionFields,
      label: opts.labels.options,
      type: 'none'
    };
  }

  _utils.fields = (function getFields(fieldData) {
    fieldData.fields = {};

    for (var prop in fieldData) {
      if (fieldData.hasOwnProperty(prop)) {
        fieldData.fields[prop] = [];
        if (typeof fieldData[prop] === 'object') {
          return getFields(fieldData[prop]);
        } else {
          let field = _utils.field(prop, fieldData[prop]);
          fieldData.fields[prop].push(field);
        }
      }
    }

    return fieldData.fields;
  })(fieldData);
  console.log(_utils);



  _utils.propMap = function(type, name) {
    let propMap = new Map(),
      propType = {
        required: 'checkbox',
        roles: 'checkbox'
      };
    propMap.set('type', propType);

    return propMap.get(type)[name] || 'text';

  };



  _utils.field = function(propName, propValue) {
    let defaultProp = {
        name: UTIL.nameAttr(propName),
        id: (propName + '-' + lastID).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
        label: opts.labels[name.toCamelCase()],
        fields: [],
        type: _utils.propMap('type', propName),
        value: ''
      },
      property;
    if (typeof propValue === 'object') {
      property = $.extend(defaultProp, propValue);
    } else {
      property = $.extend({}, defaultProp);
    }

    return property;
  };

  return properties;
};

var FormBuilder = function(element, options) {
  'use strict';

  var formBuilder = this;

  var defaults = {
    prefix: 'fb-',
    dataType: 'json', // xml or json
    // Uneditable fields or other content you would like to
    // appear before and after regular fields.
    disableFields: {
      // before: '<h2>Header</h2>',
      // after: '<h3>Footer</h3>'
    },
    // array of objects with fields values
    // ex:
    // defaultFields: [{
    //   label: 'First Name',
    //   name: 'first-name',
    //   required: 'true',
    //   description: 'Your first name',
    //   type: 'text'
    // }, {
    //   label: 'Phone',
    //   name: 'phone',
    //   description: 'How can we reach you?',
    //   type: 'text'
    // }],
    // defaultFields: [],
    roles: [{
      value: 1,
      label: 'Administrator'
    }],
    saveUrl: false,
    showWarning: false,
    serializePrefix: 'frmb',
    labels: {
      add: 'Add Item',
      allowSelect: 'Allow Select',
      autocomplete: 'Autocomplete',
      cannotBeEmpty: 'This field cannot be empty',
      checkboxGroup: 'Checkbox Group',
      checkbox: 'Checkbox',
      checkboxes: 'Checkboxes',
      'class': 'Class',
      clearAllMessage: 'Are you sure you want to remove all items?',
      clearAll: 'Clear All',
      close: 'Close',
      copy: 'Copy To Clipboard',
      date: 'Date Field',
      description: 'Help Text',
      descriptionField: 'Description',
      devMode: 'Developer Mode',
      disableFields: 'These fields cannot be moved.',
      editNames: 'Edit Names',
      editXML: 'Edit XML',
      fieldRemoveWarning: 'Are you sure you want to remove this field?',
      getStarted: 'Drag a field from the right to this area',
      hide: 'Edit',
      id: 'ID',
      label: 'Label',
      labelEmpty: 'Field Label cannot be empty',
      limitRole: 'Limit access to one or more of the following roles:',
      mandatory: 'Mandatory',
      maxLength: 'Max Length',
      minOptionMessage: 'This field requires a minimum of 2 options',
      name: 'Name',
      no: 'No',
      off: 'Off',
      on: 'On',
      optional: 'optional',
      options: 'Options',
      optionLabelPlaceholder: 'Label',
      optionValuePlaceholder: 'Value',
      optionEmpty: 'Option value required',
      paragraph: 'Paragraph',
      preview: 'Preview',
      radioGroup: 'Radio Group',
      radio: 'Radio',
      removeMessage: 'Remove Element',
      remove: '&#215;',
      required: 'Required',
      roles: 'Limit Access',
      save: 'Save Template',
      selectOptions: 'Select Items',
      select: 'Select',
      selectionsMessage: 'Allow Multiple Selections',
      text: 'Text Field',
      textarea: 'Text Area',
      warning: 'Warning!',
      viewXML: 'View XML',
      yes: 'Yes'
    }
  };

  // var opts = Object.assign(defaults, options);

  // opts.fields = function() {
  //   let fields = [
  //     'text',
  //     'textarea',
  //     'select'
  //   ];

  //   return fields.map(function(index, elem) {

  //     let field = {
  //       meta: {
  //         label: opts.labels[elem]
  //       },
  //       attrs: {
  //         type: elem
  //       }
  //     };
  //     return field;
  //   });

  // };



  // formBuilder.init = (function(element) {
  //   formBuilder.controls = new Controls(opts);
  //   element.appendChild(formBuilder.controls);
  // })(element);

};

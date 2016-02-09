/*
formBuilder - http://kevinchappell.github.io/formBuilder/
Version: 1.3.0
Author: Kevin Chappell <kevin.b.chappell@gmail.com>
*/
'use strict';

var _helpers = function _helpers(opts) {
  var _helpers = {
    doCancel: false
  },
      $form = $(document.getElementById(opts.formID));

  /**
   * Remove duplicates from an array of elements
   * @param  {array} arrArg array with possible duplicates
   * @return {array}        array with only unique values
   */
  _helpers.uniqueArray = function (arrArg) {
    return arrArg.filter(function (elem, pos, arr) {
      return arr.indexOf(elem) === pos;
    });
  };

  /**
   * Callback for when a drag begins
   * @param  {object} event
   * @param  {object} ui
   */
  _helpers.startDrag = function (event, ui) {
    event = event;
    ui.item.addClass('moving');
    _helpers.startIndex = $('li', this).index(ui.item);
  };

  /**
   * Callback for when a drag ends
   * @param  {object} event
   * @param  {object} ui
   */
  _helpers.stopDrag = function (event, ui) {
    event = event;
    ui.item.removeClass('moving');
    if (_helpers.doCancel) {
      $(ui.sender).sortable('cancel');
      $(this).sortable('cancel');
    }
  };

  /**
   * Make strings safe to be used as classes
   * @param  {string} str string to be converted
   * @return {string}     converter string
   */
  _helpers.safename = function (str) {
    return str.replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-]/g, '').toLowerCase();
  };

  /**
   * Strips non-numbers from a number only input
   * @param  {string} str string with possible number
   * @return {string}     string without numbers
   */
  _helpers.forceNumber = function (str) {
    return str.replace(/[^0-9]/g, '');
  };

  /**
   * [initTooltip description]
   * @param  {[type]} tt [description]
   * @return {[type]}    [description]
   */
  _helpers.initTooltip = function (tt) {
    var tooltip = tt.find('.tooltip');
    tt.mouseenter(function () {
      if (tooltip.outerWidth() > 200) {
        tooltip.addClass('max-width');
      }
      tooltip.css('left', tt.width() + 14);
      tooltip.stop(true, true).fadeIn('fast');
    }).mouseleave(function () {
      tt.find('.tooltip').stop(true, true).fadeOut('fast');
    });
    tooltip.hide();
  };

  // saves the field data to our canvas (elem)
  _helpers.save = function () {

    var $fieldData = $form.children('li.form-field').not('.disabled');

    // console.log(formData);

    if ('xml' === opts.dataType) {
      elem.val($form.toXML());
    } else {
      // var fieldJSON =
    }
  };

  // updatePreview will generate the preview for radio and checkbox groups
  _helpers.updatePreview = function (field) {
    var preview;

    // $('.sortable-options li', field).each(function() {
    //   var option = $('.select-option', $(this))[0].outerHTML;
    //   var label = $('.option-label', $(this)).val();
    //   preview += option + ' ' + label + '<br/>';
    // });

    $('.prev-holder', field).html(preview);
  };

  /**
   * Generate unique name with epoch timestamp
   * @param  {string} type eg. 'text'
   * @return {string}      'text-1443885404543'
   */
  _helpers.nameAttr = function (type) {
    var epoch = new Date().getTime();
    return type + '-' + epoch;
  };

  _helpers.htmlEncode = function (value) {
    return $('<div/>').text(value).html();
  };

  _helpers.htmlDecode = function (value) {
    return $('<div/>').html(value).text();
  };

  /**
   * Some basic validation before submitting our form to the backend
   * @return {void}
   */
  _helpers.validateForm = function () {
    var errors = [];
    // check for empty field labels
    $('input[name="label"], input[type="text"].option', $form).each(function () {
      if ($(this).val() === '') {
        var field = $(this).parents('li.form-field'),
            fieldAttr = $(this);

        errors.push({
          field: field,
          error: opts.labels.labelEmpty,
          attribute: fieldAttr
        });
      }
    });

    // @todo add error = { noVal: opts.labels.labelEmpty }
    if (errors.length) {
      alert('Error: ' + errors[0].error);
      $('html, body').animate({
        scrollTop: errors[0].field.offset().top
      }, 1000, function () {
        var targetID = $('.toggle-form', errors[0].field).attr('id');
        $('.toggle-form', errors[0].field).addClass('open').parent().next('.prev-holder').slideUp(250);
        $(document.getElementById(targetID + '-fld')).slideDown(250, function () {
          errors[0].attribute.addClass('error');
        });
      });
    }
  };

  /**
   * Display a custom tooltip for disabled fields.
   * @param  {object} field [description]
   * @return {void}
   */
  _helpers.disabledTT = function (field) {
    var title = field.attr('data-tooltip');
    if (title) {
      field.removeAttr('title').data('tip_text', title);
      var tt = $('<p/>', {
        'class': 'frmb-tt'
      }).html(title);
      field.append(tt);
      tt.css({
        top: -tt.outerHeight(),
        left: -15
      });
      field.mouseleave(function () {
        $(this).attr('data-tooltip', field.data('tip_text'));
        $('.frmb-tt').remove();
      });
    }
  };

  /**
   * Convert hyphenated strings to camelCase
   * @return {string}
   */
  String.prototype.toCamelCase = function () {
    return this.replace(/(\-\w)/g, function (matches) {
      return matches[1].toUpperCase();
    });
  };

  /**
   * Generate markup wrapper where needed
   * @param  {string} type
   * @param  {object} attrs
   * @param  {string} content we wrap this
   * @return {string}
   */
  _helpers.markup = function (type) {
    var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var content = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

    attrs = _helpers.attrString(attrs);
    content = Array.isArray(content) ? content.join('') : content;
    var inlineElems = ['input'],
        template = inlineElems.indexOf(type) === -1 ? '<' + type + ' ' + attrs + '>' + content + '</' + type + '>' : '<' + type + ' ' + attrs + '/>';
    return template;
  };

  /**
   * Takes and object of attributes and converts them to string
   * @param  {object} attrs
   * @return {string}
   */
  _helpers.attrString = function (attrs) {
    var attributes = [];
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        attributes.push(attr + '="' + attrs[attr] + '"');
      }
    }
    return attributes.join(' ');
  };

  /**
   * Remove a field from the form
   * @param  {object} $field [description]
   */
  _helpers.removeField = function ($field) {
    $field.slideUp(250, function () {
      $(this).remove();
      _helpers.save();
    });
  };

  return _helpers;
};
'use strict';

var FormBuilder = function FormBuilder(element, options) {
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
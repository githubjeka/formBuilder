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

(function ($) {
  'use strict';

  var Toggle = function Toggle(element, options) {

    var defaults = {
      theme: 'fresh',
      labels: {
        off: 'Off',
        on: 'On'
      }
    };

    var opts = $.extend(defaults, options),
        $kcToggle = $('<div class="kc-toggle"/>').insertAfter(element).append(element);

    $kcToggle.toggleClass('on', element.is(':checked'));

    var kctOn = '<div class="kct-on">' + opts.labels.on + '</div>',
        kctOff = '<div class="kct-off">' + opts.labels.off + '</div>',
        kctHandle = '<div class="kct-handle"></div>',
        kctInner = '<div class="kct-inner">' + kctOn + kctHandle + kctOff + '</div>';

    $kcToggle.append(kctInner);

    $kcToggle.click(function () {
      element.attr('checked', !element.attr('checked'));
      $(this).toggleClass('on');
    });
  };

  $.fn.kcToggle = function (options) {
    var toggle = this;
    return toggle.each(function () {
      var element = $(this);
      if (element.data('kcToggle')) {
        return;
      }
      var kcToggle = new Toggle(element, options);
      element.data('kcToggle', kcToggle);
    });
  };
})(jQuery);
'use strict';

(function ($) {
  'use strict';
  $.fn.toXML = function (options) {
    var defaults = {
      prepend: '',
      attributes: ['class']
    };
    var opts = $.extend(defaults, options);

    var serialStr = '';

    // Begin the core plugin
    this.each(function () {
      var liCount = 0;
      var c = 1;

      if ($(this).children().length >= 1) {
        serialStr += '<form-template>\n\t<fields>';

        // build new xml
        $(this).children().each(function () {
          var $field = $(this);
          if (!($field.hasClass('moving') || $field.hasClass('disabled'))) {
            for (var att = 0; att < opts.attributes.length; att++) {
              var required = $('input.required', $field).is(':checked') ? 'required="true" ' : 'required="false" ',
                  multipleChecked = $('input[name="multiple"]', $field).is(':checked'),
                  multiple = multipleChecked ? 'style="multiple" ' : '',
                  t = $field.attr(opts.attributes[att]).replace(' form-field', ''),
                  // field type
              multipleField = t.match(/(select|checkbox-group|radio-group)/),
                  type = 'type="' + t + '" ',
                  fName = 'name="' + $('input.fld-name', $field).val() + '" ',
                  fLabel = 'label="' + $('input.fld-label', $field).val() + '" ',
                  roleVals = $.map($('input.roles-field:checked', $field), function (n) {
                return n.value;
              }).join(','),
                  roles = roleVals !== '' ? 'role="' + roleVals + '" ' : '',
                  desc = 'description="' + $('input.fld-description', $field).val() + '" ',
                  maxLengthVal = $('input.fld-max-length', $field).val(),
                  maxLength = 'max-length="' + (maxLengthVal !== undefined ? maxLengthVal : '') + '" ',
                  fSlash = !multipleField ? '/' : '';

              var fToggle = $('.checkbox-toggle', $field).is(':checked') ? 'toggle="true" ' : '';

              serialStr += '\n\t\t<field ' + fName + fLabel + fToggle + multiple + roles + desc + (maxLengthVal !== '' ? maxLengthVal !== undefined ? maxLength : '' : '') + required + type + fSlash + '>';
              if (multipleField) {
                c = 1;
                $('.sortable-options li', $field).each(function () {
                  var $option = $(this),
                      optionValue = 'value="' + $('.option-value', $option).val() + '"',
                      optionLabel = $('.option-label', $option).val(),
                      selected = $('.select-option', $option).is(':checked') ? ' selected="true"' : '';
                  serialStr += '\n\t\t\t<option' + selected + ' ' + optionValue + '>' + optionLabel + '</option>';
                  c++;
                });
                serialStr += '\n\t\t</field>';
              }
            }
          }
          liCount++;
        });
        serialStr += '\n\t</fields>\n</form-template>';
      } // if "$(this).children().length >= 1"
    });
    return serialStr;
  };
})(jQuery);
'use strict';

(function ($) {
  'use strict';
  var FormBuilder = function FormBuilder(element, options) {

    var defaults = {
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
      defaultFields: [],
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

    var opts = $.extend(true, defaults, options),
        elem = $(element),
        frmbID = 'frmb-' + $('ul[id^=frmb-]').length++;

    opts.formID = frmbID;

    var lastID = 1,
        boxID = frmbID + '-control-box';

    var UTIL = _helpers(opts);

    var formData = new Map();

    function Field(fieldData) {
      this.elem = elem;
    }

    Field.prototype.json = function () {};

    /**
     * Prepare the properties for the field so they can be generated and edited later on.
     * @param  {object} fieldData
     * @return {array}            an array of property objects
     */
    var prepProperties = function prepProperties(fieldData) {

      var availableRoles = fieldData.meta.roles.map(function (elem) {
        elem.type = 'checkbox';
        return elem;
      });
      fieldData.propOrder = {
        meta: ['label', 'description', 'roles'],
        attrs: ['required', 'name', 'class']
      };

      fieldData.attrs.name = fieldData.attrs.name || UTIL.nameAttr(fieldData.attrs.type);

      // if field type is not checkbox, checkbox/radio group or select list, add max length
      if ($.inArray(fieldData.type, ['checkbox', 'select', 'checkbox-group', 'date', 'autocomplete']) === -1 && !fieldData.attrs.maxLength) {
        fieldData.attrs.maxLength = '';
        fieldData.propOrder.attrs.push('maxLength');
      }

      fieldData.meta.roles = {
        options: availableRoles,
        value: 1,
        type: 'checkbox'
      };

      // options need a field for value, label and checkbox to select
      if (fieldData.options) {
        var optionFields = fieldData.options.map(function (elem, index) {
          var option = {
            options: [],
            type: 'none'
          };
          for (var prop in elem) {
            if (elem.hasOwnProperty(prop)) {
              var field = {
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

      // delete fieldData.attrs.type;

      for (var prop in fieldData) {
        if (fieldData.hasOwnProperty(prop)) {
          if (fieldData.propOrder[prop]) {
            fieldData.propOrder[prop] = sortProperties(fieldData.propOrder[prop], fieldData[prop]);
          }
        }
      }

      return fieldData;
    };

    var sortProperties = function sortProperties(order, fieldData) {
      for (var prop in fieldData) {
        if (fieldData.hasOwnProperty(prop)) {
          order = UTIL.uniqueArray(order.concat(Object.keys(fieldData))).map(function (elem) {
            return elem;
          });
        }
      }
      return order;
    };

    var fieldTypes = [{
      id: 'text',
      'class': 'icon-text'
    }, {
      id: 'autocomplete',
      'class': 'icon-autocomplete'
    }, {
      id: 'select',
      'class': 'icon-select'
    }, {
      id: 'textarea',
      'class': 'icon-text-area'
    }, {
      id: 'date',
      'class': 'icon-calendar'
    }, {
      id: 'radio-group',
      'class': 'icon-radio-group'
    }, {
      id: 'checkbox',
      'class': 'icon-checkbox'
    }, {
      id: 'checkbox-group',
      'class': 'icon-checkbox-group'
    }];

    // Create draggable fields for formBuilder
    var cbUL = $('<ul/>', {
      id: boxID,
      'class': 'frmb-control'
    });

    // Setup the input fields
    var frmbFields = fieldTypes.map(function (elem) {

      // be sure elem.id is converted to camelCase to get label
      var fieldLabel = elem.id.toCamelCase(),
          idName = UTIL.nameAttr(elem.id),
          fieldData = {
        meta: {
          description: '',
          roles: opts.roles,
          label: opts.labels[fieldLabel]
        },
        attrs: {
          type: elem.id,
          name: idName,
          'class': elem['class'],
          required: false,
          id: idName
        }
      };

      if ($.inArray(elem.id, ['select', 'checkbox-group', 'radio-group']) !== -1) {
        fieldData.options = [{
          selected: false,
          value: 'option-1-value',
          label: 'Option 1 Label'
        }, {
          selected: false,
          value: 'option-2-value',
          label: 'Option 2 Label'
        }];
      }

      fieldData.properties = prepProperties(fieldData);

      return $('<li/>', fieldData.attrs).data('fieldData', fieldData).html(fieldData.meta.label).removeAttr('type');
    });

    cbUL.append(frmbFields);

    // Build our headers and action links
    var viewXML = $('<a/>', {
      id: frmbID + '-export-xml',
      text: opts.labels.viewXML,
      'class': 'view-xml'
    }),
        allowSelect = $('<a/>', {
      id: frmbID + '-allow-select',
      text: opts.labels.allowSelect,
      'class': 'allow-select'
    }).prop('checked', 'checked'),
        editXML = $('<a/>', {
      id: frmbID + '-edit-xml',
      text: opts.labels.editXML,
      'class': 'edit-xml'
    }),
        editNames = $('<a/>', {
      id: frmbID + '-edit-names',
      text: opts.labels.editNames,
      'class': 'edit-names'
    }),
        clearAll = $('<button/>', {
      text: opts.labels.clearAll,
      'class': 'clear-all btn btn-default'
    }),
        saveBtn = $('<button/>', {
      id: frmbID + '-save',
      text: opts.labels.save,
      'class': 'save btn btn-primary'
    }),
        formActions = $('<div/>', {
      id: frmbID + '-actions',
      'class': 'form-actions btn-group'
    }),
        actionLinksInner = $('<div/>', {
      id: frmbID + '-action-links-inner',
      'class': 'action-links-inner'
    }).append(editXML, ' | ', editNames, ' | ', allowSelect, ' | ', clearAll, ' |&nbsp;'),
        devMode = $('<span/>', {
      'class': 'dev-mode-link'
    }).html(opts.labels.devMode + ' ' + opts.labels.off),
        actionLinks = $('<div/>', {
      id: frmbID + '-action-links',
      'class': 'action-links'
    }).append(actionLinksInner, devMode);

    formActions.append(clearAll, saveBtn);

    // Sortable fields
    var $sortableFields = $('<ul/>').attr('id', frmbID).addClass('frmb').sortable({
      cursor: 'move',
      opacity: 0.9,
      beforeStop: function beforeStop(event, ui) {
        event = event;
        var lastIndex = $('> li', $sortableFields).length - 1,
            curIndex = ui.placeholder.index();
        UTIL.doCancel = curIndex <= 1 || curIndex === lastIndex;
      },
      over: function over(event) {
        $(event.target).parent().addClass('active');
      },
      start: UTIL.startDrag,
      stop: UTIL.stopDrag,
      cancel: 'input, .disabled, .sortable-options, .add, .btn, .no-drag, .prev-holder select',
      placeholder: 'frmb-placeholder'
    });

    // ControlBox with different fields
    cbUL.sortable({
      helper: 'clone',
      opacity: 0.9,
      connectWith: $sortableFields,
      cursor: 'move',
      placeholder: 'ui-state-highlight',
      start: UTIL.startDrag,
      stop: UTIL.stopDrag,
      revert: 150,
      remove: function remove(event, ui) {
        if (UTIL.startIndex === 0) {
          cbUL.prepend(ui.item);
        } else {
          $('li:eq(' + (UTIL.startIndex - 1) + ')', cbUL).after(ui.item);
        }
      },
      update: function update(event, ui) {
        elem.stopIndex = $('li', $sortableFields).index(ui.item) === 0 ? '0' : $('li', $sortableFields).index(ui.item);
        if ($('li', $sortableFields).index(ui.item) < 0) {
          $(this).sortable('cancel');
        } else {
          prepFieldVars(ui.item, true);
        }
      },
      receive: function receive(event, ui) {
        if (ui.sender.hasClass('frmb') || ui.sender.hasClass('frmb-control')) {
          $(ui.sender).sortable('cancel');
        }
      }
    });

    // Replace the textarea with sortable list.
    elem.before($sortableFields).parent().addClass('frmb-wrap').append(actionLinks, viewXML);

    var cbWrap = $('<div/>', {
      id: frmbID + '-cb-wrap',
      'class': 'cb-wrap'
    }).append(cbUL, formActions);

    var $formWrap = $('.frmb-wrap').before(cbWrap).append(actionLinks);

    var doSave = function doSave() {
      if ($(this).parents('li.disabled').length === 0) {
        if ($(this).name === 'label' && $(this).val() === '') {
          return alert('Error: ' + opts.labels.labelEmpty);
        }
        UTIL.save();
      }
    };

    // Not pretty but we need to save a lot so users don't have to keep clicking a save button
    $('input, select', $sortableFields).on('change', doSave);
    $('input, select', $sortableFields).on('blur', doSave);

    // Parse saved XML template data
    elem.getTemplate = function () {
      var xml = elem.val() !== '' ? $.parseXML(elem.val()) : false,
          fields = $(xml).find('field');
      if (fields.length > 0) {
        fields.each(function () {
          prepFieldVars($(this));
        });
      } else if (!xml) {
        // Load default fields if none are set
        if (opts.defaultFields.length) {
          for (var i = opts.defaultFields.length - 1; i >= 0; i--) {
            appendField(opts.defaultFields[i]);
          }
        } else {
          $formWrap.addClass('empty').attr('data-content', opts.labels.getStarted);
        }
        disabledBeforeAfter();
      }
    };

    var disabledBeforeAfter = function disabledBeforeAfter() {
      var li = '<li class="disabled __POSITION__">__CONTENT__</li>';
      if (opts.disableFields.before && !$('.disabled.before', $sortableFields).length) {
        $sortableFields.prepend(li.replace('__POSITION__', 'before').replace('__CONTENT__', opts.disableFields.before));
      }
      if (opts.disableFields.after && !$('.disabled.after', $sortableFields).length) {
        $sortableFields.append(li.replace('__POSITION__', 'after').replace('__CONTENT__', opts.disableFields.after));
      }
    };

    var prepFieldVars = function prepFieldVars($field) {
      var fieldData = $field.data('fieldData');
      appendField(fieldData);
      $formWrap.removeClass('empty');
      disabledBeforeAfter();
    };

    /**
     * Append our field to the stage
     * @param  {object} fieldData
     * @return {string}           markup for our field, includes properties and preview
     */
    var appendField = function appendField(fieldData) {
      var li = '',
          delBtn = UTIL.markup('a', {
        'class': 'del-button btn',
        title: opts.labels.removeMessage,
        id: 'del_' + lastID
      }, opts.labels.remove),
          toggleBtn = UTIL.markup('a', {
        id: 'frm-' + lastID,
        'class': 'toggle-form btn icon-pencil',
        title: opts.labels.hide
      }),
          required = UTIL.markup('span', {
        'class': 'required-asterisk'
      }, '*'),
          tooltip = fieldData.description ? UTIL.markup('span', {
        'class': 'tooltip-element',
        tooltip: fieldData.description
      }, '?') : '',
          fieldLabel = UTIL.markup('div', {
        'class': 'field-label'
      }, [fieldData.label, required, tooltip]),
          fieldActions = UTIL.markup('div', {
        'class': 'field-actions'
      }, [toggleBtn, delBtn]);

      var liContent = UTIL.markup('div', {
        'class': 'field-properties'
      }, fieldSettings(fieldData));

      li = UTIL.markup('li', {
        // id: 'frm-' + lastID + '-item',
        id: UTIL.nameAttr(fieldData.attrs.type),
        'data-type': fieldData.attrs.type,
        'class': fieldData.attrs.type + ' form-field'
      }, [fieldActions, fieldLabel, fieldPreview(fieldData), liContent]);

      if (elem.stopIndex) {
        $('li', $sortableFields).eq(elem.stopIndex).after(li);
      } else {
        $sortableFields.append(li);
      }

      $(document.getElementById('frm-' + lastID + '-item')).hide().slideDown(250);

      lastID++;

      // let curFieldData = JSON.stringify(fieldData);
      // formData.set(fieldData.attrs.id, curFieldData);
      UTIL.save();
    };

    var fieldSettings = function fieldSettings(fieldData) {
      var markup = [],
          propOrder = fieldData.propOrder,
          propertyMarkup = undefined;
      for (var section in propOrder) {
        if (fieldData.hasOwnProperty(section)) {
          propertyMarkup = fieldProperties(propOrder[section], fieldData[section]).join('');
          markup.push(propertyMarkup);
        }
      }

      return markup.join('');
    };

    /**
     * Build the editable properties for the field
     * @param  {object} fieldData configuration object for field
     * @return {string}        markup for advanced fields
     */
    var fieldProperties = function fieldProperties(order, properties) {
      return order.map(function (property) {
        console.log(property, properties[property]);
        var field = UTIL.markup('div', {
          'class': 'field-property ' + property + '-wrap'
        }, fieldSetting(properties[property]));
        return field;
      });
    };

    var fieldSetting = function fieldSetting(property) {
      var depth = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var name = property.name || '',
          propertyId = (name + '-' + lastID).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
          label = property.label || opts.labels[name.toCamelCase()] || false,
          fields = property.fields || [],
          type = property.type || 'text',
          value = property.value || '',
          setting = [];

      if (name === 'required') {
        type = 'checkbox';
      }

      if (property.options) {
        depth++;
        fields = property.options.map(function (val) {
          return fieldSetting(val, depth);
        });

        fields = UTIL.markup('div', {
          'class': 'property-options-' + depth
        }, fields);
      }

      if ('none' !== type) {

        var attrs = {
          type: type,
          name: propertyId,
          value: value,
          id: propertyId,
          'class': 'edit-' + name
        };

        if (depth === 2) {
          attrs.placeholder = label.charAt(0).toUpperCase() + label.slice(1);
        } else if (depth === 1) {
          setTimeout(function () {
            $('.property-options-1', document.getElementById('frm-' + lastID + '-item')).sortable();
          }, 1000);
        }

        setting.push(UTIL.markup('input', attrs));
      }

      if (label) {
        setting.push(UTIL.markup('label', {
          'for': propertyId
        }, label));
      }

      setting.push(setting, fields);

      return setting.join('');
    };

    /**
     * Generate preview markup
     * @param  {object} attrs
     * @return {string}       preview markup for field
     */
    var fieldPreview = function fieldPreview(fieldData) {

      delete fieldData.attrs['class'];

      var field = {},
          type = fieldData.attrs.type.toCamelCase();

      field.text = function (fieldData) {
        var fieldAttrs = UTIL.attrString(fieldData.attrs),
            field = '<input ' + fieldAttrs + '>',
            value = fieldData.attrs.value || '',
            fieldLabel = '<label for="' + fieldData.attrs.id + '">' + fieldData.label + '</label>',
            templates = {};

        templates.text = fieldLabel + field;
        templates.password = templates.text;
        templates.autocomplete = templates.text;
        templates.date = templates.text;

        return templates[fieldData.attrs.type];
      };

      field.password = Object.assign(field.text);
      field.email = field.text;
      field.date = field.text;
      field.autocomplete = field.text;

      field.textarea = function (fieldData) {
        var fieldAttrs = UTIL.attrString(fieldData.attrs),
            value = fieldData.attrs.value || '',
            textArea = '<textarea ' + fieldAttrs + '>' + value + '</textarea>',
            fieldLabel = '<label for="' + fieldData.attrs.id + '">' + fieldData.label + '</label>';

        return fieldLabel + textArea;
      };

      field.checkbox = function (fieldData) {
        var fieldAttrs = UTIL.attrString(fieldData.attrs);
        return '<label for="' + fieldData.attrs.id + '"><input ' + fieldAttrs + '> ' + fieldData.label + '</label>';
      };

      field.radio = field.checkbox;

      field.select = function (fieldData) {
        var options = undefined,
            attrs = fieldData.attrs,
            option = function option(opt) {
          var selected = opt.selected ? 'selected' : '';
          return '<option value="' + opt.value + '" ' + selected + '>' + opt.label + '</option>';
        },
            i = undefined;
        fieldData.options.reverse();
        for (i = fieldData.options.length - 1; i >= 0; i--) {
          options += option(fieldData.options[i]);
        }
        return '<' + attrs.type + '>' + options + '</' + attrs.type + '>';
      };

      field.checkboxGroup = function (fieldData) {
        var preview = [],
            checkbox = Object.assign({}, fieldData);
        checkbox.attrs.type = checkbox.attrs.type.replace('-group', '');
        checkbox.attrs.name = checkbox.attrs.name + '[]';
        delete checkbox.options;
        fieldData.options.forEach(function (option) {
          checkbox.label = option.label;
          checkbox.attrs.value = option.value;
          preview.push(field[checkbox.attrs.type](checkbox));
        });

        return preview.join('');
      };

      field.radioGroup = field.checkboxGroup;
      return '<div class="prev-holder">' + field[type](fieldData) + '</div>';
    };

    // ---------------------- UTILITIES ---------------------- //

    // delete options
    $sortableFields.on('click', '.remove', function (e) {
      e.preventDefault();
      var optionsCount = $(this).parents('.sortable-options:eq(0)').children('li').length;
      if (optionsCount <= 2) {
        alert('Error: ' + opts.labels.minOptionMessage);
      } else {
        $(this).parent('li').slideUp('250', function () {
          $(this).remove();
        });
      }
    });

    // toggle fields
    $sortableFields.on('click', '.toggle-form', function (e) {
      e.preventDefault();
      var $field = $(this).parents('.form-field:eq(0)');
      $field.toggleClass('editing');
      $('.prev-holder', $field).slideToggle(250);
      $('.field-properties', $field).slideToggle(250, function () {
        // do something after attr toggle
      });
    });

    // update preview to label
    $sortableFields.on('keyup', '.edit-label', function (e) {
      $('.field-label', $(this).closest('li')).html($(this).val());
    });

    // remove error styling when users tries to correct mistake
    $sortableFields.on('keyup', 'input.error', function () {
      $(this).removeClass('error');
    });

    $sortableFields.on('keyup', '.edit-description', function (e) {
      e.preventDefault();
      var closestToolTip = $('.tooltip-element', $(this).closest('li'));
      if ($(this).val() !== '') {
        if (!closestToolTip.length) {
          var tt = '<span class="tooltip-element" tooltip="' + $(this).val() + '">?</span>';
          $('.field-label', $(this).closest('li')).append(tt);
          // UTIL.initTooltip(tt);
        } else {
            closestToolTip.attr('tooltip', $(this).val()).css('display', 'inline-block');
          }
      } else {
        if (closestToolTip.length) {
          closestToolTip.css('display', 'none');
        }
      }
    });

    // format name attribute
    $sortableFields.on('keyup', '.edit-name', function () {
      $(this).val(UTIL.safename($(this).val()));
      if ($(this).val() === '') {
        $(this).addClass('field_error').attr('placeholder', opts.labels.cannotBeEmpty);
      } else {
        $(this).removeClass('field_error');
      }
    });

    $sortableFields.on('keyup', 'input.fld-max-length', function () {
      $(this).val(UTIL.forceNumber($(this).val()));
    });

    // Delete field
    $sortableFields.on('click', '.del-button', function (e) {
      e.preventDefault();

      var $field = $(this).parents('.form-field:eq(0)');

      if (opts.showWarning || true) {
        // double check that the user really wants to remove the field
        showRemoveWarning($field);
      } else {
        UTIL.removeField($field);
      }
    });

    var showRemoveWarning = function showRemoveWarning($field) {
      $('<div />', {
        title: opts.labels.warning
      }).append(opts.labels.fieldRemoveWarning).dialog({
        modal: true,
        resizable: false,
        dialogClass: 'ite-warning',
        buttons: [{
          text: opts.labels.yes,
          click: function click() {
            UTIL.removeField($field);
            $(this).dialog('close');
          }
        }, {
          text: opts.labels.no,
          click: function click() {
            $(this).dialog('close');
          }
        }]
      }, opts.labels.warning);
    };

    // Attach a callback to toggle required asterisk
    $sortableFields.on('click', '.edit-required', function () {
      var requiredAsterisk = $(this).parents('li.form-field').find('.required-asterisk');
      requiredAsterisk.toggle();
    });

    // Attach a callback to toggle roles visibility
    $sortableFields.on('click', '.edit-roles', function () {
      var roles = $(this).siblings('.property-options-1'),
          enableRolesCB = $(this);
      roles.slideToggle(250, function () {
        if (!enableRolesCB.is(':checked')) {
          $('input[type="checkbox"]', roles).removeAttr('checked');
        }
      });
    });

    $sortableFields.on('mouseenter', 'li.disabled .form-element', function () {
      UTIL.disabledTT($(this));
    });

    // Attach a callback to close link
    $sortableFields.on('click', '.close-field', function (e) {
      e.preventDefault();
      $(this).parents('li.form-field').find('.toggle-form').trigger('click');
    });

    $sortableFields.on('hover', '.del-button', function (e) {
      console.log('hovering!!');
      var $field = $(this).parents('.form-field:eq(0)');
      $field.toggleClass('delete');
    });

    // View XML
    $(document.getElementById(frmbID + '-export-xml')).click(function (e) {
      e.preventDefault();
      var xml = elem.val(),
          $pre = $('<pre />').text(xml);
      $pre.dialog({
        resizable: false,
        modal: true,
        width: 720,
        dialogClass: 'frmb-xml',
        overlay: {
          color: '#333333'
        }
      });
    });

    // Clear all fields in form editor
    // @todo refactor, this no longer accounts for new data model
    clearAll.click(function (e) {
      e.preventDefault();
      if (window.confirm(opts.labels.clearAllMessage)) {
        $sortableFields.empty();
        elem.val('');
        UTIL.save();
        elem.getTemplate();
      }
    });

    clearAll.hover(function () {
      $(this).toggleClass('btn-danger').toggleClass('btn-default');
    });

    // Save Idea Template
    $(document.getElementById(frmbID + '-save')).click(function (e) {
      e.preventDefault();
      if (!$formWrap.hasClass('edit-xml')) {
        UTIL.save();
      }
      UTIL.validateForm(e);
    });

    var triggerDevMode = false,
        keys = [],
        devCode = '68,69,86';
    // Super secret Developer Tools
    $('.save.btn').mouseover(function () {
      triggerDevMode = true;
    }).mouseout(function () {
      triggerDevMode = false;
    });
    $(document.documentElement).keydown(function (e) {
      keys.push(e.keyCode);
      if (keys.toString().indexOf(devCode) >= 0) {
        $('.action-links').toggle();
        $('.view-xml').toggle();
        keys = [];
      }
    });
    // Toggle Developer Mode
    $('.dev-mode-link').click(function (e) {
      e.preventDefault();
      var dml = $(this);
      $formWrap.toggleClass('dev-mode');
      dml.parent().css('opacity', 1);
      if ($formWrap.hasClass('dev-mode')) {
        dml.siblings('.action-links-inner').css('width', '100%');
        dml.html(opts.labels.devMode + ' ' + opts.labels.on).css('color', '#8CC63F');
      } else {
        dml.siblings('.action-links-inner').css('width', 0);
        dml.html(opts.labels.devMode + ' ' + opts.labels.off).css('color', '#666666');
        triggerDevMode = false;
        $('.action-links').toggle();
        $('.view-xml').toggle();
      }
    });

    // Toggle Edit Names
    $(document.getElementById(frmbID + '-edit-names')).click(function (e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('.name_wrap', $sortableFields).slideToggle(250, function () {
        $formWrap.toggleClass('edit-names');
      });
    });

    // Toggle Allow Select
    $(document.getElementById(frmbID + '-allow-select')).click(function (e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('.allow-multi, .select-option', $sortableFields).slideToggle(250, function () {
        $formWrap.toggleClass('allow-select');
      });
    });

    // Toggle Edit XML
    $(document.getElementById(frmbID + '-edit-xml')).click(function (e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('textarea.idea-template').show();
      $('.template-textarea-wrap').slideToggle(250);
      $formWrap.toggleClass('edit-xml');
    });

    $formWrap.css('min-height', cbUL.height() - 48);
    elem.wrap('<div class="template-textarea-wrap"/>').getTemplate();
  };

  $.fn.formBuilder = function (options) {
    var form = this;
    return form.each(function () {
      var element = $(this);
      if (element.data('formBuilder')) {
        return;
      }
      var formBuilder = new FormBuilder(this, options);
      element.data('formBuilder', formBuilder);
    });
  };
})(jQuery);
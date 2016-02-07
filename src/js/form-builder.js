(function($) {
  'use strict';
  var FormBuilder = function(element, options) {

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

    Field.prototype.json = () => {

    };


    /**
     * Prepare the properties for the field so they can be generated and edited later on.
     * @param  {object} fieldData
     * @return {array}            an array of property objects
     */
    var prepProperties = function(fieldData) {
      var properties = Object.assign({}, fieldData);

      var availableRoles = properties.meta.roles.map(function(elem) {
          elem.type = 'checkbox';
          return elem;
        }),
        sortedProperties,
        defaultOrder = {
          meta: ['label', 'description', 'roles'],
          attrs: ['class', 'required', 'name']
        };

      properties.name = properties.attrs.name || UTIL.nameAttr(properties.attrs.type);


      console.log(properties);


      // if field type is not checkbox, checkbox/radio group or select list, add max length
      if ($.inArray(properties.type, ['checkbox', 'select', 'checkbox-group', 'date', 'autocomplete']) === -1 && !properties.attrs.maxLength) {
        properties.attrs.maxLength = '';
        defaultOrder.push('maxLength');
      }

      properties.meta.roles = {
        options: availableRoles,
        value: 1,
        type: 'checkbox'
      };

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

        properties.options = {
          options: optionFields,
          label: opts.labels.options,
          type: 'none'
        };
      }

      delete properties.attrs.type;

      for (var prop in properties) {
        if (properties.hasOwnProperty(prop)) {
          properties[prop] = sortProperties(defaultOrder, prop);
        }
      }


      return fieldProperties;
    };

    var sortProperties = function(order, properties) {
      let sortedProps = [];
      if (Array.isArray(properties)) {
        sortedProps = UTIL.uniqueArray(order.concat(Object.keys(properties))).map(function(elem) {
          let property = {
            name: elem
          };
          if (typeof properties[elem] === 'object') {
            Object.assign(property, properties[elem]);
          } else {
            property.value = properties[elem];
          }
          return property;
        });
      } else {
        sortedProps.push(properties);
      }

      return sortedProps;
    };



    var fieldTypes = [{
      id: 'text',
      class: 'icon-text'
    }, {
      id: 'autocomplete',
      class: 'icon-autocomplete'
    }, {
      id: 'select',
      class: 'icon-select'
    }, {
      id: 'textarea',
      class: 'icon-text-area'
    }, {
      id: 'date',
      class: 'icon-calendar'
    }, {
      id: 'radio-group',
      class: 'icon-radio-group'
    }, {
      id: 'checkbox',
      class: 'icon-checkbox'
    }, {
      id: 'checkbox-group',
      class: 'icon-checkbox-group'
    }];

    // Create draggable fields for formBuilder
    var cbUL = $('<ul/>', {
      id: boxID,
      'class': 'frmb-control'
    });

    // Setup the input fields
    var frmbFields = fieldTypes.map(function(elem) {

      // be sure elem.id is converted to camelCase to get label
      let fieldLabel = elem.id.toCamelCase(),
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
            'class': elem.class,
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

      return $('<li/>', fieldData.attrs).data('fieldData', fieldData).html(fieldData.label).removeAttr('type');
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
      beforeStop: function(event, ui) {
        event = event;
        var lastIndex = $('> li', $sortableFields).length - 1,
          curIndex = ui.placeholder.index();
        UTIL.doCancel = ((curIndex <= 1) || (curIndex === lastIndex));
      },
      over: function(event) {
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
      remove: function(event, ui) {
        if (UTIL.startIndex === 0) {
          cbUL.prepend(ui.item);
        } else {
          $('li:eq(' + (UTIL.startIndex - 1) + ')', cbUL).after(ui.item);
        }
      },
      update: function(event, ui) {
        elem.stopIndex = ($('li', $sortableFields).index(ui.item) === 0 ? '0' : $('li', $sortableFields).index(ui.item));
        if ($('li', $sortableFields).index(ui.item) < 0) {
          $(this).sortable('cancel');
        } else {
          prepFieldVars(ui.item, true);
        }
      },
      receive: function(event, ui) {
        if (ui.sender.hasClass('frmb') || ui.sender.hasClass('frmb-control')) {
          $(ui.sender).sortable('cancel');
        }
      }
    });

    // Replace the textarea with sortable list.
    elem
      .before($sortableFields)
      .parent()
      .addClass('frmb-wrap')
      .append(actionLinks, viewXML);

    var cbWrap = $('<div/>', {
      id: frmbID + '-cb-wrap',
      'class': 'cb-wrap'
    }).append(cbUL, formActions);

    var $formWrap = $('.frmb-wrap').before(cbWrap).append(actionLinks);

    var doSave = function() {
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
    elem.getTemplate = function() {
      var xml = (elem.val() !== '' ? $.parseXML(elem.val()) : false),
        fields = $(xml).find('field');
      if (fields.length > 0) {
        fields.each(function() {
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

    var disabledBeforeAfter = function() {
      var li = '<li class="disabled __POSITION__">__CONTENT__</li>';
      if (opts.disableFields.before && !$('.disabled.before', $sortableFields).length) {
        $sortableFields.prepend(li.replace('__POSITION__', 'before').replace('__CONTENT__', opts.disableFields.before));
      }
      if (opts.disableFields.after && !$('.disabled.after', $sortableFields).length) {
        $sortableFields.append(li.replace('__POSITION__', 'after').replace('__CONTENT__', opts.disableFields.after));
      }
    };

    var prepFieldVars = function($field) {
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
    var appendField = function(fieldData) {
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
        tooltip = (fieldData.description ? UTIL.markup('span', {
          'class': 'tooltip-element',
          tooltip: fieldData.description
        }, '?') : ''),
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

      let curFieldData = JSON.stringify(fieldData);
      formData.set(fieldData.attrs.id, curFieldData);
      UTIL.save();
    };

    var fieldSettings = function(fieldData) {
      let markup = [],
        propertyMarkup = fieldProperties(fieldData.properties).join('');
      markup.push(propertyMarkup);

      return markup.join('');
    };

    /**
     * Build the editable properties for the field
     * @param  {object} fieldData configuration object for field
     * @return {string}        markup for advanced fields
     */
    var fieldProperties = function(properties) {
      return properties.map(function(property) {
        let field = UTIL.markup('div', {
          'class': `field-property ${property.name}-wrap`
        }, fieldSetting(property));
        return field;
      });
    };

    var fieldSetting = function(property, depth = 0) {
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
        fields = property.options.map(function(val) {
          return fieldSetting(val, depth);
        });

        fields = UTIL.markup('div', {
          'class': 'property-options-' + depth
        }, fields);
      }

      if ('none' !== type) {

        let attrs = {
          type: type,
          name: propertyId,
          value: value,
          id: propertyId,
          'class': 'edit-' + name
        };

        if (depth === 2) {
          attrs.placeholder = label.charAt(0).toUpperCase() + label.slice(1);
        } else if (depth === 1) {
          setTimeout(function() {
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
    var fieldPreview = function(fieldData) {

      delete fieldData.attrs.class;

      var field = {},
        type = fieldData.attrs.type.toCamelCase();

      field.text = function(fieldData) {
        let fieldAttrs = UTIL.attrString(fieldData.attrs),
          field = `<input ${fieldAttrs}>`,
          value = fieldData.attrs.value || '',
          fieldLabel = `<label for="${fieldData.attrs.id}">${fieldData.label}</label>`,
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


      field.textarea = function(fieldData) {
        let fieldAttrs = UTIL.attrString(fieldData.attrs),
          value = fieldData.attrs.value || '',
          textArea = `<textarea ${fieldAttrs}>${value}</textarea>`,
          fieldLabel = `<label for="${fieldData.attrs.id}">${fieldData.label}</label>`;

        return fieldLabel + textArea;
      };

      field.checkbox = function(fieldData) {
        let fieldAttrs = UTIL.attrString(fieldData.attrs);
        return `<label for="${fieldData.attrs.id}"><input ${fieldAttrs}> ${fieldData.label}</label>`;
      };

      field.radio = field.checkbox;

      field.select = function(fieldData) {
        let options,
          attrs = fieldData.attrs,
          option = (opt) => {
            let selected = opt.selected ? 'selected' : '';
            return `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
          },
          i;
        fieldData.options.reverse();
        for (i = fieldData.options.length - 1; i >= 0; i--) {
          options += option(fieldData.options[i]);
        }
        return `<${attrs.type}>${options}</${attrs.type}>`;
      };

      field.checkboxGroup = (fieldData) => {
        let preview = [],
          checkbox = Object.assign({}, fieldData);
        checkbox.attrs.type = checkbox.attrs.type.replace('-group', '');
        checkbox.attrs.name = checkbox.attrs.name + '[]';
        delete checkbox.options;
        fieldData.options.forEach(function(option) {
          checkbox.label = option.label;
          checkbox.attrs.value = option.value;
          preview.push(field[checkbox.attrs.type](checkbox));
        });

        return preview.join('');
      };

      field.radioGroup = field.checkboxGroup;
      return `<div class="prev-holder">${field[type](fieldData)}</div>`;
    };

    // ---------------------- UTILITIES ---------------------- //

    // delete options
    $sortableFields.on('click', '.remove', function(e) {
      e.preventDefault();
      var optionsCount = $(this).parents('.sortable-options:eq(0)').children('li').length;
      if (optionsCount <= 2) {
        alert('Error: ' + opts.labels.minOptionMessage);
      } else {
        $(this).parent('li').slideUp('250', function() {
          $(this).remove();
        });
      }
    });

    // toggle fields
    $sortableFields.on('click', '.toggle-form', function(e) {
      e.preventDefault();
      var $field = $(this).parents('.form-field:eq(0)');
      $field.toggleClass('editing');
      $('.prev-holder', $field).slideToggle(250);
      $('.field-properties', $field).slideToggle(250, function() {
        // do something after attr toggle
      });
    });

    // update preview to label
    $sortableFields.on('keyup', '.edit-label', function(e) {
      $('.field-label', $(this).closest('li')).html($(this).val());
    });

    // remove error styling when users tries to correct mistake
    $sortableFields.on('keyup', 'input.error', function() {
      $(this).removeClass('error');
    });

    $sortableFields.on('keyup', '.edit-description', function(e) {
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
    $sortableFields.on('keyup', '.edit-name', function() {
      $(this).val(UTIL.safename($(this).val()));
      if ($(this).val() === '') {
        $(this).addClass('field_error').attr('placeholder', opts.labels.cannotBeEmpty);
      } else {
        $(this).removeClass('field_error');
      }
    });

    $sortableFields.on('keyup', 'input.fld-max-length', function() {
      $(this).val(UTIL.forceNumber($(this).val()));
    });

    // Delete field
    $sortableFields.on('click', '.del-button', function(e) {
      e.preventDefault();

      var $field = $(this).parents('.form-field:eq(0)');

      if (opts.showWarning || true) {
        // double check that the user really wants to remove the field
        showRemoveWarning($field);
      } else {
        UTIL.removeField($field);
      }
    });

    var showRemoveWarning = function($field) {
      $('<div />', {
        title: opts.labels.warning
      }).append(opts.labels.fieldRemoveWarning).dialog({
        modal: true,
        resizable: false,
        dialogClass: 'ite-warning',
        buttons: [{
          text: opts.labels.yes,
          click: function() {
            UTIL.removeField($field);
            $(this).dialog('close');
          }
        }, {
          text: opts.labels.no,
          click: function() {
            $(this).dialog('close');
          }
        }]
      }, opts.labels.warning);
    };

    // Attach a callback to toggle required asterisk
    $sortableFields.on('click', '.edit-required', function() {
      var requiredAsterisk = $(this).parents('li.form-field').find('.required-asterisk');
      requiredAsterisk.toggle();
    });

    // Attach a callback to toggle roles visibility
    $sortableFields.on('click', '.edit-roles', function() {
      var roles = $(this).siblings('.property-options-1'),
        enableRolesCB = $(this);
      roles.slideToggle(250, function() {
        if (!enableRolesCB.is(':checked')) {
          $('input[type="checkbox"]', roles).removeAttr('checked');
        }
      });
    });

    $sortableFields.on('mouseenter', 'li.disabled .form-element', function() {
      UTIL.disabledTT($(this));
    });

    // Attach a callback to close link
    $sortableFields.on('click', '.close-field', function(e) {
      e.preventDefault();
      $(this).parents('li.form-field').find('.toggle-form').trigger('click');
    });

    $sortableFields.on('hover', '.del-button', function(e) {
      console.log('hovering!!');
      var $field = $(this).parents('.form-field:eq(0)');
      $field.toggleClass('delete');
    });

    // View XML
    $(document.getElementById(frmbID + '-export-xml')).click(function(e) {
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
    clearAll.click(function(e) {
      e.preventDefault();
      if (window.confirm(opts.labels.clearAllMessage)) {
        $sortableFields.empty();
        elem.val('');
        UTIL.save();
        elem.getTemplate();
      }
    });

    clearAll.hover(function() {
      $(this).toggleClass('btn-danger').toggleClass('btn-default');
    });

    // Save Idea Template
    $(document.getElementById(frmbID + '-save')).click(function(e) {
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
    $('.save.btn').mouseover(function() {
      triggerDevMode = true;
    }).mouseout(function() {
      triggerDevMode = false;
    });
    $(document.documentElement).keydown(function(e) {
      keys.push(e.keyCode);
      if (keys.toString().indexOf(devCode) >= 0) {
        $('.action-links').toggle();
        $('.view-xml').toggle();
        keys = [];
      }
    });
    // Toggle Developer Mode
    $('.dev-mode-link').click(function(e) {
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
    $(document.getElementById(frmbID + '-edit-names')).click(function(e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('.name_wrap', $sortableFields).slideToggle(250, function() {
        $formWrap.toggleClass('edit-names');
      });
    });

    // Toggle Allow Select
    $(document.getElementById(frmbID + '-allow-select')).click(function(e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('.allow-multi, .select-option', $sortableFields).slideToggle(250, function() {
        $formWrap.toggleClass('allow-select');
      });
    });

    // Toggle Edit XML
    $(document.getElementById(frmbID + '-edit-xml')).click(function(e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('textarea.idea-template').show();
      $('.template-textarea-wrap').slideToggle(250);
      $formWrap.toggleClass('edit-xml');
    });

    $formWrap.css('min-height', cbUL.height() - 48);
    elem
      .wrap('<div class="template-textarea-wrap"/>')
      .getTemplate();
  };


  $.fn.formBuilder = function(options) {
    var form = this;
    return form.each(function() {
      var element = $(this);
      if (element.data('formBuilder')) {
        return;
      }
      var formBuilder = new FormBuilder(this, options);
      element.data('formBuilder', formBuilder);
    });
  };

})(jQuery);

var _helpers = function(opts) {
  var _helpers = {
    doCancel: false
  },
  $form = $(document.getElementById(opts.formID));

  /**
   * Remove duplicates from an array of elements
   * @param  {array} arrArg array with possible duplicates
   * @return {array}        array with only unique values
   */
  _helpers.uniqueArray = (arrArg) => {
    return arrArg.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });
  };

  /**
   * Callback for when a drag begins
   * @param  {object} event
   * @param  {object} ui
   */
  _helpers.startDrag = function(event, ui) {
    event = event;
    ui.item.addClass('moving');
    _helpers.startIndex = $('li', this).index(ui.item);
  };

  /**
   * Callback for when a drag ends
   * @param  {object} event
   * @param  {object} ui
   */
  _helpers.stopDrag = function(event, ui) {
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
  _helpers.safename = function(str) {
    return str.replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-]/g, '').toLowerCase();
  };


  /**
   * Strips non-numbers from a number only input
   * @param  {string} str string with possible number
   * @return {string}     string without numbers
   */
  _helpers.forceNumber = function(str) {
    return str.replace(/[^0-9]/g, '');
  };

  /**
   * [initTooltip description]
   * @param  {[type]} tt [description]
   * @return {[type]}    [description]
   */
  _helpers.initTooltip = function(tt) {
    var tooltip = tt.find('.tooltip');
    tt.mouseenter(function() {
      if (tooltip.outerWidth() > 200) {
        tooltip.addClass('max-width');
      }
      tooltip.css('left', tt.width() + 14);
      tooltip.stop(true, true).fadeIn('fast');
    }).mouseleave(function() {
      tt.find('.tooltip').stop(true, true).fadeOut('fast');
    });
    tooltip.hide();
  };

  // saves the field data to our canvas (elem)
  _helpers.save = function() {

    let $fieldData = $form.children('li.form-field').not('.disabled');

    // console.log(formData);

    if ('xml' === opts.dataType) {
      elem.val($form.toXML());
    } else {
      // var fieldJSON =
    }
  };

  // updatePreview will generate the preview for radio and checkbox groups
  _helpers.updatePreview = function(field) {
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
  _helpers.nameAttr = function(type) {
    var epoch = new Date().getTime();
    return type + '-' + epoch;
  };

  _helpers.htmlEncode = function(value) {
    return $('<div/>').text(value).html();
  };

  _helpers.htmlDecode = function(value) {
    return $('<div/>').html(value).text();
  };

  /**
   * Some basic validation before submitting our form to the backend
   * @return {void}
   */
  _helpers.validateForm = function() {
    var errors = [];
    // check for empty field labels
    $('input[name="label"], input[type="text"].option', $form).each(function() {
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
      }, 1000, function() {
        var targetID = $('.toggle-form', errors[0].field).attr('id');
        $('.toggle-form', errors[0].field).addClass('open').parent().next('.prev-holder').slideUp(250);
        $(document.getElementById(targetID + '-fld')).slideDown(250, function() {
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
  _helpers.disabledTT = function(field) {
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
      field.mouseleave(function() {
        $(this).attr('data-tooltip', field.data('tip_text'));
        $('.frmb-tt').remove();
      });
    }
  };

  /**
   * Convert hyphenated strings to camelCase
   * @return {string}
   */
  String.prototype.toCamelCase = function() {
    return this.replace(/(\-\w)/g, function(matches) {
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
  _helpers.markup = function(type, attrs = {}, content = '') {
    attrs = _helpers.attrString(attrs);
    content = Array.isArray(content) ? content.join('') : content;
    let inlineElems = ['input'],
      template = inlineElems.indexOf(type) === -1 ? `<${type} ${attrs}>${content}</${type}>` : `<${type} ${attrs}/>`;
    return template;
  };


  /**
   * Takes and object of attributes and converts them to string
   * @param  {object} attrs
   * @return {string}
   */
  _helpers.attrString = function(attrs) {
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
  _helpers.removeField = function($field) {
    $field.slideUp(250, function() {
      $(this).remove();
      _helpers.save();
    });
  };

  return _helpers;
};

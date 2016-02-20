(function($) {
  'use strict';

  $.fn.formBuilder = function(options) {
    var form = this;
    return form.each(function() {
      var element = this,
      formBuilder = new FormBuilder(element, options);
      if ($(formBuilder).data('formBuilder')) {
        return;
      }
      $(formBuilder).data('formBuilder', formBuilder);
    });
  };

})(jQuery);

function Controls(opts) {
  'use strict';

  var controls = document.createElement('div');
  controls.class = 'fb-control-wrapper';

  var inputControls = opts.fields.map(function(index, elem) {
    let inputControl = new Field('button', {
      class: `${opts.prefix}${elem.attrs.type}`
    }),
    label = document.createTextNode(elem.meta.label);
    inputControl.appendChild(label);

    return inputControl;
  });


  controls.appendChild(inputControls);

  return controls;
}

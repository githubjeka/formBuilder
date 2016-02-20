function Controls(opts) {
  'use strict';

  var controls = document.createElement('div');
  controls.className = 'fb-control-wrapper col-md-4';

  opts.fields.map(function(elem, index) {

    let inputControl = new Field('button', {
      class: `${opts.prefix}${elem.attrs.type}-control fb-control`,
      type: 'button'
    }),
    label = document.createTextNode(elem.meta.label);
    inputControl.appendChild(label);
    controls.appendChild(inputControl);

    return inputControl;
  });


  return controls;
}

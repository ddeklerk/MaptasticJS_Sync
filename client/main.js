import _ from 'lodash';
import { Mapping } from '../imports/api/mapping/mapping.js';
import { Meteor } from 'meteor/meteor';
import { upsert } from '../imports/api/mapping/methods.js';
import '../client/functions/sync.js';

function doStuff() {
  const mapping = Mapping.findOne();

  function myChangeHandler() {
    const layouts = element.getLayout();
    layouts.forEach(layout => {
      upsert.call(layout);
      console.log(layout.id);
    });
    }

  const configObject = {
    autoSave: true,
    autoLoad: true,
    labels: true,
    layers: ["mt","mt2","mt3","mt4"],
    onchange: _.debounce(myChangeHandler, 500),
  };

  const element = Maptastic(configObject);
  const layouts = element.getLayout();

  if (mapping) {
    element.setLayout([{
      id: layouts[0].id,
      sourcePoints: layouts[0].sourcePoints,
      targetPoints: mapping.targetPoints,
    }]);
  } else {
    layouts.forEach(layout => {
      upsert.call(layout);
    });
  }

  Mapping.find().observeChanges({
    changed: (changedId, fields) => {
      const layouts = element.getLayout();
      console.log(changedId );
      console.log(layouts);
      const { id, sourcePoints } = layouts[0];
      const { targetPoints } = fields;
      element.setLayout([{
        id,
        sourcePoints,
        targetPoints,
      }]);
      console.log(id + ", S:" + sourcePoints + ", T: " + targetPoints);
    },
  });
}

Meteor.startup(() => {
  const sub = Meteor.subscribe('mapping', {
    onReady: () => {
      doStuff();
    }
  });
});
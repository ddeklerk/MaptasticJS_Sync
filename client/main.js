import _ from 'lodash';

import { Meteor } from 'meteor/meteor';
import { Mapping } from '../imports/api/mapping/mapping.js';
import { upsert } from '../imports/api/mapping/methods.js';

import '../client/functions/sync.js';
import '../client/functions/yt_encode.js';

window.mapping = Mapping;

function newMT(id) {
  return new Maptastic({
    autoLoad: false,
    autoSave: false,
    labels: true,
    layers: [id],
    onchange: _.debounce(myChangeHandler.bind(null, id), 500),
  });
}

const maptasticObjects = {
  mt1: newMT('mt1'),
  mt2: newMT('mt2'),
  // mt3: newMT('mt3'),
  // mt4: newMT('mt4'),
};

function myChangeHandler(id) {
  const layouts = maptasticObjects[id].getLayout();

  layouts.forEach(layout => {
    upsert.call(layout);
  });
}

Meteor.subscribe('mapping', () => {
  _.forEach(maptasticObjects, (object, id) => {
    const mapping = Mapping.findOne({ id });

    if (mapping) {
      object.setLayout([{
        id,
        sourcePoints: object.getLayout()[0].sourcePoints,
        targetPoints: mapping.targetPoints,
      }]);
    } else {
      upsert.call(object.getLayout()[0]);
    }
  });
});

Mapping.find().observeChanges({
  changed: (changedId, fields) => {
    const { id } = Mapping.findOne(changedId);

    const { targetPoints } = fields;

    const object = maptasticObjects[id];

    const sourcePoints = object.getLayout()[0].sourcePoints;

    object.setLayout([{
      id,
      sourcePoints,
      targetPoints,
    }]);
  },
});

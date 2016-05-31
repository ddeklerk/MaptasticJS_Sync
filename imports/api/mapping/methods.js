import { Mapping } from './mapping.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const upsert = new ValidatedMethod({
  name: 'mapping.upsert',
  validate: new SimpleSchema({
    id: {
      type: String,
    },
    targetPoints: {
      type: [[Number]],
      decimal: true,
    },
    sourcePoints: {
      type: [[Number]],
      decimal: true,
    },
  }).validator(),
  run(layout) {
    Mapping.update({
      id: layout.id,
    }, {
      $set: {
        sourcePoints: layout.sourcePoints,
        targetPoints: layout.targetPoints,
      },
    }, {
      upsert: true,
    });
  },
});

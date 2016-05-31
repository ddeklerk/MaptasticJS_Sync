import { Meteor } from 'meteor/meteor';
import { Mapping } from '../mapping.js';

Meteor.publish('mapping', () => {
  return Mapping.find();
});

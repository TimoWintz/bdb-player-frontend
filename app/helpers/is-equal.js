import Ember from 'ember';

export function isEqual(values) {
  return values[0] === values[1];
}

export default Ember.Helper.helper(isEqual);

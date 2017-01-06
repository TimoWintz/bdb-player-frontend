import Ember from 'ember';

export function formatItemId(params/*, hash*/) {
  return "playlist-item-" + params[0].toString();
}

export default Ember.Helper.helper(formatItemId);

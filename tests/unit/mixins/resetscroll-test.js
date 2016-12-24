import Ember from 'ember';
import ResetscrollMixin from 'music-player/mixins/resetscroll';
import { module, test } from 'qunit';

module('Unit | Mixin | resetscroll');

// Replace this with your real tests.
test('it works', function(assert) {
  let ResetscrollObject = Ember.Object.extend(ResetscrollMixin);
  let subject = ResetscrollObject.create();
  assert.ok(subject);
});

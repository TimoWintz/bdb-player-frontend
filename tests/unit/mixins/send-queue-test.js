import Ember from 'ember';
import SendQueueMixin from 'music-player/mixins/send-queue';
import { module, test } from 'qunit';

module('Unit | Mixin | send queue');

// Replace this with your real tests.
test('it works', function(assert) {
  let SendQueueObject = Ember.Object.extend(SendQueueMixin);
  let subject = SendQueueObject.create();
  assert.ok(subject);
});

import Ember from 'ember';

export default Ember.Controller.extend({
	queue: Ember.inject.service('play-queue'),
	hifi: Ember.inject.service()
});

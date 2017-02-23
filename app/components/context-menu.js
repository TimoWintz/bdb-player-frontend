import Ember from 'ember';
import SendQueueMixin from '../mixins/send-queue';


export default Ember.Component.extend(SendQueueMixin, {
	cMenu: Ember.inject.service("context-menu-service"),
});

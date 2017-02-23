import Ember from 'ember';
import SendQueueMixin from '../mixins/send-queue';

export default Ember.Component.extend(SendQueueMixin, {
    prefix : "",
    item : null,
    isOpen : false,
    actions : {
    toggleOpen() {
        if (this.get("item.folder")) {
            this.toggleProperty("isOpen");
        }
    }
    }
});

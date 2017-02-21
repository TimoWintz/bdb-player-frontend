import Ember from 'ember';

export default Ember.Component.extend({
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

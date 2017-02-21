import Ember from 'ember';

export default Ember.Component.extend({
    prefix : "",
    item : null,
    tagName : 'a',
    isOpen : false,
    click(e) {
        e.stopPropagation();
        if (this.get("item.folder")) {
            this.toggleProperty("isOpen");
        }
    }
});

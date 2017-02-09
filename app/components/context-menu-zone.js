import Ember from 'ember';

export default Ember.Component.extend({
    cMenu : Ember.inject.service("context-menu-service"),
    type: null,
    objectId: null,
    contextMenu(ev) {
        this.set('cMenu.type', this.get('type'));
        this.set('cMenu.objectId', this.get('objectId'));
        this.get('cMenu').openMenu(ev.clientX, ev.clientY);
        return false;
    }
});

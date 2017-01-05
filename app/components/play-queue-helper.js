import Ember from 'ember';

export default Ember.Component.extend({
    replace : false,
    play: false,
    type: null,
    object: null,
    playQueue : Ember.inject.service('play-queue'),
    tagName: 'a',
    click() {
        console.log("hello");
    }
});

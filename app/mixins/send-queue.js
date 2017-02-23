import Ember from 'ember';

export default Ember.Mixin.create({
    playQueue : Ember.inject.service("play-queue"),
    actions : {
        send(replace, play, type, search, id) {
            this.get('playQueue').send(replace, play, type, search, id);
        }
    }
});

import Ember from 'ember';

let setCurrentTrack = function(track) {            
    if (this.currentTrack != null) {
        this.currentTrack.set('isPlaying', false);
    }
    this.set('currentTrack', track);
    track.set('isPlaying', true);
};
let formatTime = function(ms){
    if (ms) {
        var min = (ms/1000/60) << 0;
        var sec = ((ms/1000) % 60) << 0;
        var secStr = ('00' + sec.toString()).slice(-2);
        return(min.toString() + ':' + secStr);
    } else {
        return '0:00';
    }
};


export default Ember.Controller.extend({
    playQueue : [], //Current play queue
    currentTrack : null, //Currently playing track
    hifi: Ember.inject.service(), // music playing service
    showPlayQueue : true,
    lastVolume : 0,
    muted : false,
    percentPlayed : Ember.computed('askedPosition', 'hifi.position', 'hifi.duration', { 
        get() {
            var pos = this.get('hifi.position');
            return Math.floor(100*pos/this.get('hifi.duration'));
        },
        set(key, value) {
            this.set('hifi.position', value/100* this.get('hifi.duration'));
            return value;
        }
    }),
    formattedPosition : Ember.computed('hifi.position', 'hifi.duration', function() {
        if(this.get('hifi.position')) {
            var pos = this.get('hifi.position');
            var tot = this.get('hifi.duration');
            return formatTime(pos) + '/' + formatTime(tot);
        } else {
            return '0:00/0:00';
        }
    }),
    actions : {
        togglePause : function() {
            if (this.get('hifi').currentSound) {
                this.get('hifi').togglePause();
            } else {
                this.send("play");
            }
        },
        setPosition : function(percent) {
            var position = percent/100 * this.get('hifi.duration');
            this.set('hifi.position', position);
        },
        play : function() {
            if (this.playQueue[0]) {
                var track = this.playQueue[0];
                setCurrentTrack.call(this, track);
                var urls = 'file/' + track.id.toString();
                this.get('hifi').play(urls).then(({sound}) => {
                    sound.on("audio-ended", function() { 
                        this.playQueue.shiftObject();
                        if (this.playQueue[0]) {
                            this.send("play");
                        }
                    }.bind(this));
                }, () => {
                    this.playQueue.shiftObject();
                    if (this.playQueue[0]) {
                        this.send("play");
                    }
                });
            }
        },
        skip : function () {
            this.playQueue.shiftObject();
            if (this.playQueue[0]) {
                this.send("play");
            }
        },
        playTrack: function(track) {
            this.set('playQueue', []);
            this.playQueue.pushObject(track);
            if (this.get('hifi.isPlaying') === true) {
                this.set('hifi.position', 0);
            }
            this.send("play");
        },
        addToPlayQueue : function(tracks) {
            var playQueue = this.playQueue;
            tracks.map(function(track) {
                playQueue.pushObject(track);
            });
        },
        togglePlayQueue : function() {
            this.toggleProperty('showPlayQueue');
        },
        setVolume : function(vol) {
            this.set("hifi.volume", vol);
        },
        toggleMute : function() {
            if (this.muted) {
                this.set("hifi.volume", this.lastVolume);
                this.set("muted", false);
            }
            else {
                this.set("lastVolume", this.get("hifi.volume"));
                this.set("hifi.volume", 0);
                this.set("muted", true);
            }
        }
    }
});

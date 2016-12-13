import Ember from 'ember';

export function formatDuration(params/*, hash*/) {
    let ms = params[0];
    if (params[1] === "sec") {
        ms = 1000*ms;
    }
    var min = (ms/1000/60) << 0;
    var sec = ((ms/1000) % 60) << 0;
    var secStr = ('00' + sec.toString()).slice(-2);
    return(min.toString() + ':' + secStr);
}

export default Ember.Helper.helper(formatDuration);

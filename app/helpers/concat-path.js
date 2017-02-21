import Ember from 'ember';

export function concatPath(params/*, hash*/) {
    if (params[0].length > 0) {
        return params[0]+"/"+params[1];
    }
    else
    {
        return params[1];
    }
}

export default Ember.Helper.helper(concatPath);

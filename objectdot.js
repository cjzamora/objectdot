(function(global, factory) {
    'use strict';

    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = function(window) {
            return factory(global);
        };
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function(window) {
    // construct
    var ObjectDot = function(object) {
        if(!(this instanceof ObjectDot)) {
            return new ObjectDot(object);
        }

        // if object is not set
        if(typeof object === 'undefined') {
            return this;
        }

        // if it's not a valid object
        if(typeof object !== 'object') {
            throw new Error('Invalid object.');   
        }

        // set object
        fn.object = object;
    }, fn = ObjectDot.prototype;

    // default object
    fn.object = {};

    fn.set = function(path, value) {
        // get the arguments
        var args = Array.prototype.slice.call(arguments);

        // if we have 1 arguments
        if(args.length == 1 
        && toString.call(path) === '[object Array]') {
            // set the entire object path
            fn.object = path;

            return this;
        }

        // do we have a path?
        if(path.length === 0) {
            return this;
        }

        // let's create a key
        var paths  = createKey(path);
        // get the path length
        var length = paths.length;

        // we only have 1?
        if(length === 1) {
            // set the path and value
            fn.object[paths.shift()] = value;
        
            return this;
        }

        // recursively add the keys
        fn.object = recurse(fn.object, value, paths, 0, length);

        return this;
    };

    fn.add = function(key, value, custom) {
        // get the current key
        var current = this.get(key);

        // if current is not set
        if(current === null) {
            // custom key?
            if(custom) {
                // set as object
                current = {};
            } else {
                // set as array
                current = [];
            }
        }

        // custom key?
        if(custom) {
            // set custom key + value
            current[custom] = value;
        } else {
            // push value to array
            current.push(value);
        }

        // set the tree
        fn.set(key, current);

        return this;
    };

    fn.get = function(path) {
        // if path is not set
        if(typeof path === 'undefined') {
            // return everything
            return fn.object;
        }

        // create path
        var paths   = createKey(path);
        // get the path length
        var length  = paths.length;

        // we only have 1 key?
        if(length === 1) {
            // key the first key
            var key = paths.shift();

            // return the key
            return (key in fn.object) ? fn.object[key] : null;
        }

        // recursively get the value
        return scan(fn.object, paths, 0, length);
    };

    var recurse = function(object, value, keys, index, max) {
        // get the current key
        var key = keys[index];

        // are we on the last part?
        if(index === (max - 1)) {
            // set key + value
            object[key] = value;

            return object;
        }

        // are we in the first index?
        if(!(key in object)) {
            // set blank object
            object[key] = {};
        }

        // re-iterate the process
        recurse(object[key], value, keys, ++index, max);

        return object;
    };

    var scan = function(object, keys, start, end) {
        // get the current
        var current = (keys[start] in object) ? object[keys[start]] : null;

        // if not found
        if(current === null) {
            return current;
        }

        // are we on the end
        if((end - 1) === start) {
            return current;
        }

        // if it's an object
        if(typeof current === 'object') {
            // re-scan object
            return scan(current, keys, ++start, end);
        }
    };

    var createKey = function(path) {
        // replace all escaped keys [...]
        var path = path.replace(/\[.*?\]/g, function(string) {
            // replace it with >
            return string.replace(/\./g, '>');
        });

        // split paths by .
        var paths = path.split('.');

        // iterate on each path and replace
        // back all the escaped keys
        for(var i in paths) {
            // replace all >
            paths[i] = paths[i].replace(/>/g, '.');
            // replace all [ ]
            paths[i] = paths[i].replace(/\[|\]/g, '');
        }

        return paths;
    };

    // expose globally
    window.ObjectDot = ObjectDot;

    return ObjectDot();
});
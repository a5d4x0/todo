class Observer{
    
    constructor(data) {
        this.data = data;
    }

    observeArray(arr, callback) {
        const methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
        const arrayProto = Array.prototype;
        const delegatePrototype = Object.create(Array.prototype);
        methods.forEach(method => {
            Object.defineProperty(delegatePrototype, method, {
                writable: true,
                enumerable: true,
                configurable: true,
                value(...arg) {
                    let val = [...arr];
                    let current = arrayProto[method].call(this, ...arg);
                    callback(current, val, ...arg);
                    return current;
                }
            });
        });
        arr.__proto__ = delegatePrototype;
    }

    observe(path, callback) {

        const data = this.data;

        let  val = path.reduce((p, cur) => p = p[cur], data);
        if(Array.isArray(val)) {
            this.observeArray(val, callback);
        }
        else if(typeof val == 'object') {
            Object.keys(val).forEach(key => {
                let p = [...path, key];
                this.observe(p, callback);
            });
        }
        else {
            const key = path.pop();
            const obj = path.length ? path.reduce((p, cur) => p = p[cur], data) :data;

            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: () => val,
                set: current => {
                    if(current !== val) {
                        callback(current, val);
                    }
                    val = current;
                }
            });

        }

    }

}

export default Observer;
import Observer from './Observer';

class Stefan {

    constructor(config) {
        this.el = document.querySelector(config.el);
        this.frag = this.node2Fragment(this.el);
        this.data = config.data;
        this.observer = new Observer(this.data);
        this.handlers = config.handlers;
        this.parse(this.frag);
        this.el.appendChild(this.frag);
    }

    node2Fragment(el) {
        let fragment = document.createDocumentFragment();
        let child = null;
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    getData(str, el) {
        const list = str.split('.');
        let data = null;
        let path = '';
        let cnt = 1;
        let p = [];
        list.forEach((key, index) => {
            if (!index) {
                data = this.data[key];
                p.push(key);
            } else {
                if (el.path) {
                    path = el.path[cnt++];
                    if (path === key) {
                        data = data[key];
                    } else {
                        p.push(path);
                        data = data[path][key];
                        cnt++;
                    }
                } else {
                    data = data[key];
                }
                p.push(key);
            }
        });
        el.path = p;
        return data;
    }

    parseList(el) {
        let list = el.dataset.list;
        const data = this.getData(list, el);
        data.forEach((item, index) => {
            const copyEl = el.cloneNode(true);
            copyEl.path = [...el.path];
            copyEl.path.push(index);
            copyEl.dataset.list = 'copyed';
            this.parse(copyEl);
            el.parentNode.insertBefore(copyEl, el);
        });
        el.pNode = el.parentNode;
        el.parentNode.removeChild(el);
    }

    parseClass(el, current, old) {
        old && el.classList.remove(old);
        el.classList.add(current);
    }

    parseModel(el, val) {
        if(val === undefined) return;
        if (el.tagName === 'INPUT') {
            el.value = val;
        } else {
            el.innerText = val;
        }
    }

    parse(el) {
        if(el.dataset && el.dataset.list && el.dataset.list != 'copyed') {
            this.parseList(el);
            this.observer.observe(el.path, (current) => {
                while (el.pNode.firstChild) {
                    el.pNode.removeChild(el.pNode.firstChild)
                }
                el.pNode.appendChild(el);
                this.parseList(el);
            });
        }
        else {
            for(let child of el.children) {
            
                child.path = el.path || [];

                let attr = '';
                let val = '';
                const dataset = child.dataset || {};

                for(attr in dataset) {
                    val = dataset[attr];
                    if(attr == 'class') {
                        if (!child.classList.contains(val)) {
                            this.parseClass(child, this.getData(val, child));
                        }
                        delete child.dataset.class;
                        this.observer.observe(child.path, (current, old) => this.parseClass(child, current, old));
                    }
                    else if(attr == 'model') {
                        this.parseModel(child, this.getData(val, child));
                        delete child.dataset.model;
                        this.observer.observe(child.path, current => this.parseModel(child, current));
                    }
                    
                    const eventMatch = attr.match(/^on(\w+)$/);
                    if(eventMatch) {
                        const cb = this.handlers[val];
                        // delete child.dataset[attr];
                        child.addEventListener(eventMatch[1].toLowerCase(), e => cb(e, this.data, child.path));
                    }

                }

                if(child.children.length && child.dataset.list != 'copyed') {
                    this.parse(child);
                }
            }
        }
        
    }

}

export default Stefan;
var vclone = (function (exports) {
'use strict';

// Remove all children from this node.
function empty(node) {
    [].slice.call(node.childNodes).forEach(node.removeChild, node);
}
//# sourceMappingURL=DOM.js.map

var Component = (function () {
    function Component(props) {
        this.props = null;
        this.props = props;
    }
    Component.prototype.render = function () {
        throw "Not implemented";
    };
    return Component;
}());

var VNode = (function () {
    function VNode(el) {
        this.renderedDOM = el;
    }
    return VNode;
}());

var createElement = function (type, props, children) {
    var renderedDOM = null;
    var className = null;
    var eventList = [];
    var attributeList = [];
    if (typeof props === 'object')
        for (var key in props) {
            if (key === 'className') {
                className = props[key];
            }
            else if (typeof props[key] === 'function') {
                eventList.push({ key: key.toLowerCase(), eventFunction: props[key] });
            }
            else if (typeof props[key] !== 'function') {
                attributeList.push({ atr: key, value: props[key] });
            }
        }
    console.log('eventList', eventList);
    if (typeof type === 'string') {
        renderedDOM = document.createElement(type);
        if (className)
            renderedDOM.className = className;
        if (eventList) {
            eventList.forEach(function (event) {
                console.log('inside event', event);
                renderedDOM.addEventListener(event.key, event.eventFunction);
            });
            attributeList.forEach(function (atr) {
                console.log('inside atr', atr);
                renderedDOM.attributes(atr.atr, atr.value);
            });
            console.log('render ', renderedDOM);
        }
        if (typeof children === 'string' || children instanceof VNode)
            children = [children];
        if (children) {
            children.forEach(function (child) {
                var el = null;
                if (typeof child === 'string') {
                    var spanWrapper = document.createElement('span');
                    spanWrapper.textContent = child;
                    el = spanWrapper;
                }
                else {
                    el = child.renderedDOM;
                }
                renderedDOM.appendChild(el);
            });
        }
        return new VNode(renderedDOM);
    }
    else if (typeof type === 'function') {
        var tempInstance = new type(props);
        console.log('function ', props);
        if (tempInstance instanceof VNode)
            return tempInstance;
        else if (tempInstance instanceof Component)
            return tempInstance.render();
    }
};
var render = function (vdom, el) {
    empty(el);
    el.appendChild(vdom.renderedDOM);
};

exports.render = render;
exports.createElement = createElement;
exports.Component = Component;

return exports;

}({}));

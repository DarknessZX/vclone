import * as DOM from './DOM'
import Component from './Component'
import VNode from './VNode'

var createElement = function (type: string | Function | Component, props: any, children: (VNode | string)[] | string | VNode): VNode {
    let renderedDOM: Element = null;
    let className:string = null;
    let eventList = [];
    let attributeList = []
    if (typeof props === 'object')
      for (var key in props) {
        if (key === 'className') {
          className = props[key];
        } else if (typeof props[key] === 'function') {
          eventList.push({ key: key.toLowerCase() , eventFunction : props[key] });
        } else if (typeof props[key] !== 'function') {
          attributeList.push({ atr : key, value : props[key] });
        }
      }
    console.log('eventList',eventList);
    if (typeof type === 'string') {
        renderedDOM = document.createElement(type);
        if (className)
            renderedDOM.className = className;
        if (eventList) {
            eventList.forEach(event => {
              console.log('inside event',event);
              renderedDOM.addEventListener(event.key, event.eventFunction);
            })
            attributeList.forEach(atr => {
              console.log('inside atr', atr);
              renderedDOM.attributes(atr.atr, atr.value);
            })
            console.log('render ',renderedDOM);
        }
        if (typeof children === 'string' || children instanceof VNode)
            children = [children];

        if (children) {
            children.forEach((child) => {
                let el : Element = null;
                if (typeof child === 'string') {
                    var spanWrapper = document.createElement('span');
                    spanWrapper.textContent = child;
                    el = spanWrapper;
                }
                else {
                    el = child.renderedDOM;
                }

                renderedDOM.appendChild(el);
            })
        }
        return new VNode(renderedDOM);
    } else if (typeof type === 'function') {
        var tempInstance = new (type as any)(props);

        console.log('function ' ,props);
        if (tempInstance instanceof VNode)
            return tempInstance;
        else if (tempInstance instanceof Component)
            return tempInstance.render();
    }
}

var render = function (vdom: VNode, el: Element) {
    DOM.empty(el);
    el.appendChild(vdom.renderedDOM);
}


export {
    render, createElement, Component
}

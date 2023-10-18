import React, {Component} from "react";
import classnames from 'classnames';

let _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

class DragScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            select: props.allowSelect === undefined ? true : props.allowSelect,
            allow: props.allow === undefined ? true : props.allow,
            dragging: false
        };
        this.Ref = React.createRef();
        this.mouseUpHandle = this.mouseUpHandle.bind(this);
        this.mouseDownHandle = this.mouseDownHandle.bind(this);
        this.mouseMoveHandle = this.mouseMoveHandle.bind(this);
        this.keyPressHandle = this.keyPressHandle.bind(this);
        this.renderChildren = this.renderChildren.bind(this);
        this.isArray = this.isArray.bind(this);
    }
    mouseUpHandle(){
        this.setState({dragging: false});
        if (this.props.onChange){
            this.props.onChange(this.state.select, false);
        }
    }
    mouseDownHandle(e){
        this.lastClientX = e.clientX;
        this.lastClientY = e.clientY;
        if (this.state.select) {
            this.setState({dragging: true});
            if (this.props.onChange){
                this.props.onChange(this.state.select, true);
            }
        }
    }
    mouseMoveHandle(e){
        if (this.state.dragging) {
            e.preventDefault();
            this.Ref.current.scrollLeft -= -this.lastClientX + (this.lastClientX = e.clientX);
            this.Ref.current.scrollTop -= -this.lastClientY + (this.lastClientY = e.clientY);
        }
    }
    keyPressHandle(){
        let select = !this.state.select;
        this.setState({select: select});
        if (this.props.onChange){
            this.props.onChange(select, this.state.dragging);
        }
    }
    renderChildren(dom){
        if (this.isArray(dom)) {
            return dom.map(function (item, index) {
                return React.cloneElement(item, {
                    key: item.key || index
                });
            });
        } else if ('object' === (typeof dom === "undefined" ? "undefined" : _typeof(dom))) {
            return React.cloneElement(dom, {});
        }
    }
    isArray(object){
        return object &&
            (typeof object === "undefined" ? "undefined" : _typeof(object)) === 'object' &&
            typeof object.length === 'number' &&
            typeof object.splice === 'function' &&
            !object.propertyIsEnumerable('length');
    }
    render () {
        let style = this.props.style ? this.props.style : {width: '100%', height: '100%'};

        let classDrag = this.state.select ? 'cursor-grab' : '';
        classDrag = this.state.dragging ? 'cursor-grabbing' : classDrag;

        return (
            <div>
                {this.state.allow && (
                    <i className="fs12 right">Bấm vào <span className="text-primary pointer text-bold" onClick={this.keyPressHandle}>đây</span> để {classDrag ? 'tắt' : 'bật'} chức năng DragScroll</i>
                )}
                <div className={classnames('overflow-auto', this.props.className, classDrag)} style={style} ref={this.Ref}
                     onMouseDown={this.mouseDownHandle}
                     onMouseUp={this.mouseUpHandle}
                     onMouseMove={this.mouseMoveHandle}
                >
                    {this.renderChildren(this.props.children)}
                </div>
            </div>
        )
    }
}

export default DragScroll;

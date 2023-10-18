import React from 'react';

export class BtnDelete extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    handleClickOutside(event) {
        if (this.ref.current && !this.ref.current.contains(event.target)) {
            this.props.handleClose && this.props.handleClose(event);
        }
    };

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    };

    render() {
        return (
            <div ><i ref={this.ref} className="fa fa-bars fs18 btn-bars"/></div>
        );
    }
}

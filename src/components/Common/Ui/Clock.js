import React from "react";
import moment from "moment";

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: null
        };
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            const now = moment().format("HH:mm:ss DD-MM-YYYY");
            this.setState({time: now});
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        const {time} = this.state;
        return (
            <b>{time}</b>
        )
    }
}

export default Clock;

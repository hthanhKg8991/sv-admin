import React from "react";
import { getRoomDetail } from 'api/auth';


class EmployerRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        };
    }

    async asyncData() {
        const { id } = this.props;
        if (id) {
            const res = await getRoomDetail({ id });
            this.setState({
                name: res?.data?.name,
            })
        }
    }

    componentDidMount() {
        this.asyncData();
    }


    render() {
        const { name } = this.state;
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-4 col-xs-4 padding0">Phòng </div>
                <div className="col-sm-8 col-xs-8 text-bold">
                    {name || "Chưa cập nhật"}
                </div>
            </div>
        )
    }
}

export default EmployerRoom;

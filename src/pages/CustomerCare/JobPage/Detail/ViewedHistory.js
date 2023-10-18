import React from "react";
import { getJobDailyDetail } from 'api/seeker';
import moment from "moment";

class ViewedHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    async asyncData() {
        const { id } = this.props;
        if (id) {
            const res = await getJobDailyDetail({ job_id: id });
            if(res) {
                this.setState({
                    data: res?.data,
                })
            }

        }
    }

    componentDidMount() {
        this.asyncData();
    }


    render() {
        const { data } = this.state;
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-4 col-xs-4 padding0">Người xem gần nhất</div>
                <div className="col-sm-8 col-xs-8 text-bold">
                    {data?.staff_username || "Chưa xem"}
                    {data?.staff_username ?
                        ` - ${moment.unix(data?.created_at).format("DD-MM-YYYY HH:mm:ss")}` : ''}
                </div>
            </div>
        )
    }
}

export default ViewedHistory;

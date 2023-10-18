import React, {Component} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import _ from "lodash";
import {connect} from "react-redux";
import {compare} from "utils/utils";
import {CHANNEL_CODE_MW, CHANNEL_CODE_TVN, CHANNEL_CODE_VL24H} from "utils/Constant";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class Chart extends Component {
    state={
        loading:true,
        data: null,
    }
    async asyncData(params = {}) {
        const {fetchApi, query} = this.props;
        const filter = _.get(params, 'filter', this.state.filter);
        const page = _.get(params, 'page', query?.page || 1);  // Ưu tiên page từ query nếu không truyền tham số
        const paramFull = {
            ...filter,
            per_page: 1,
            page: page,
        };
        delete paramFull['action'];
        delete paramFull['id'];
        const ChannelListApi = [
            fetchApi({...paramFull,channel_code:CHANNEL_CODE_TVN}),
            fetchApi({...paramFull,channel_code:CHANNEL_CODE_VL24H}),
            fetchApi({...paramFull,channel_code:CHANNEL_CODE_MW}),
        ]
        const dataChart = await Promise.all(ChannelListApi).then((values)=>{
            return values.map(i=>i?.total_items || 0);
        });
        if (dataChart) {
            this.setState({
                loading: false,
                data: dataChart,
                filter: filter,
            });
        }
    }
    componentDidMount() {
        const {query, fetchApi} = this.props;
        if (fetchApi) {
            this.asyncData({filter: query});
        } else {
            this.setState({
                loading: false,
            });
        }
    }
    componentWillReceiveProps(newProps) {
        const {idKey} = this.props;
        const filterIdKey = 'Filter' + idKey;
        if (_.has(newProps, filterIdKey) && compare(this.props[filterIdKey],
            newProps[filterIdKey])) {
            let params = _.get(newProps, filterIdKey);
            this.setState({loading: true}, () => {
                this.asyncData({filter: params, page: 1});
            });
        }
    }
    render(){
        const labels = ['Tổng', 'TVN', 'VL24H', 'MW'];
        const {data} = this.state;


        if(!data){
            return <LoadingSmall />
        }

        const sum = data?.reduce((a,b)=> a+b,0);
        const dataChart = {
            labels,
            datasets: [
                {
                    label: 'Số lượng hồ sơ',
                    data: [sum,...data],
                    backgroundColor: 'rgba(53, 162, 235, 0.8)',
                },
            ],
        };

        return <div className="row">
            <h3 className="ml10">Tìm thấy <strong>{sum}</strong> hồ sơ phù hợp với tiêu chí tìm kiếm</h3>
            <div className="col-md-4"><Bar data={dataChart} /></div>
        </div>;
    }
}

function mapStateToProps(state, ownProps) {
    const {idKey} = ownProps;

    return {
        ['Filter' + idKey]: state.filter[idKey]
    };
}

export default connect(mapStateToProps, null)(Chart);

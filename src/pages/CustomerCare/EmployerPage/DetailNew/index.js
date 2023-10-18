import React from "react";
import {getDetail} from "api/employer";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Info from "pages/CustomerCare/EmployerPage/DetailNew/Info";
import ServiceActivated from "pages/CustomerCare/EmployerPage/DetailNew/ServiceActivated";
import ServiceBought from "pages/CustomerCare/EmployerPage/DetailNew/ServiceBought";
import LibraryImage from "pages/CustomerCare/EmployerPage/DetailNew/LibraryImage";
import {subscribe} from "utils/event";
import {getEffect, getService} from "api/system";
import * as Constant from "utils/Constant";
import BannerCover from "pages/CustomerCare/EmployerPage/DetailNew/BannerCover";
import NetSaleInfomation from "pages/CustomerCare/EmployerPage/DetailNew/NetSaleInfo";
import ServicePointManagement from "pages/CustomerCare/EmployerPage/DetailNew/ServicePointManagement ";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            employer: null,
            services: null,
            effects: null,
            loading: true
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }

    async asyncData(){
        const {id} = this.state;

        const data = await getDetail(id);
        if(data){
            this.setState({
                employer: data,
                loading: false
            });
        }
    }

    async getAllService() {
        const res = await getService({status: Constant.STATUS_SERVICE_ALL});
        if(res) {
            this.setState({services: res});
        }
    }

    async getAllEffect() {
        const res = await getEffect({status: Constant.STATUS_SERVICE_ALL});
        if(res) {
            this.setState({effects: res});
        }
    }

    componentDidMount(){
        this.asyncData();
        this.getAllService();
        this.getAllEffect();
    }

    render() {
        const {history, idKey, tabActive} = this.props;
        const {loading, employer, services, effects} = this.state;
        const items = [
            {
                title: "Thông tin chung",
                component: <Info employer={employer} history={history} idKey={idKey}/>
            },
            {
                title: "Quản lý điểm dịch vụ",
                component: <ServicePointManagement employer={employer} history={history} services={services} effects={effects}/>
            },
            {
                title: "Dịch vụ đã kích hoạt",
                component: <ServiceActivated employer={employer} history={history} services={services} effects={effects}/>
            },
            {
                title: "Lịch sử mua dịch vụ",
                component: <ServiceBought employer={employer} history={history}/>
            },
            {
                title: "Thư viện ảnh",
                component: <LibraryImage employer={employer} history={history}/>,
            },
            {
                title: "Banner Cover",
                component: <BannerCover employer={employer} history={history}/>,
            },
            {
                title: "Thông tin Net sale",
                component: <NetSaleInfomation employer={employer} history={history}/>,
            }
        ];

        return (
            <React.Fragment>
                {loading
                    ? <LoadingSmall style={{textAlign: "center"}}/>
                    : <Tab items={items} tabActive={tabActive}/>
                }
            </React.Fragment>
        );
    }
}

export default Detail;

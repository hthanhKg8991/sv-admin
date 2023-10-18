import React from "react";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import HistoryChangeEmail from "pages/QualityControlEmployer/RequirementApprovePage/Detail/HistoryChangeEmail";
import HistoryChangeTitle from "pages/QualityControlEmployer/RequirementApprovePage/Detail/HistoryChangeTitle";
import HistoryChangeCompany from "pages/QualityControlEmployer/RequirementApprovePage/Detail/HistoryChangeCompany";
import HistoryChangeEmailVerify from "pages/QualityControlEmployer/RequirementApprovePage/Detail/HistoryChangeEmailVerify";
import Info from "pages/QualityControlEmployer/RequirementApprovePage/Detail/Requirement";
import {subscribe} from "utils/event";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }

    async asyncData(){
        this.setState({
            loading: false
        });
    }

    render() {
        const {history} = this.props;
        const {loading} = this.state;
        const items = [
            {
                title: "Chờ duyệt",
                component: <Info history={history}/>
            },
            {
                title: "Lịch sử duyệt đổi tên công ty",
                component: <HistoryChangeCompany history={history} idKey={"HistoryChangeCompany"}/>
            },
            {
                title: "Lịch sử duyệt đổi email",
                component: <HistoryChangeEmail history={history} idKey={"HistoryChangeEmail"}/>
            },
            {
                title: "Lịch sử duyệt yêu cầu xác thực email",
                component: <HistoryChangeEmailVerify history={history} idKey={"HistoryChangeEmailVerify"}/>
            },
            {
                title: "Lịch sử duyệt yêu cầu đổi tiêu đề tin",
                component: <HistoryChangeTitle history={history} idKey={"HistoryChangeTitle"}/>
            }
        ];

        return (
            <React.Fragment>
                {loading
                    ? <LoadingSmall style={{textAlign: "center"}}/>
                    : <Tab items={items}/>
                }
            </React.Fragment>
        );
    }
}

export default Index;

import React from "react";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Default from "components/Layout/Page/Default";
import FromCreated from "pages/CustomerCare/StatisticEmployerPage/FromCreated.js";
import FromCompanySize from "pages/CustomerCare/StatisticEmployerPage/FromCompanySize.js";

class index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            loading: false
        };
    }

    render() {
        const {history} = this.props;
        const {loading} = this.state;
        const items = [
            {
                title: "Thống Kê Theo Nguồn Tạo",
                component: <FromCreated history={history}/>
            },
            {
                title: "Thống Kê Theo Quy Mô Công Ty",
                component: <FromCompanySize history={history}/>
            },
        ];

        return (
            <React.Fragment>
                {loading
                    ? <LoadingSmall style={{textAlign: "center"}}/>
                    :   <Default
                            title="Thống Kê Khách Hàng">
                            <Tab items={items}/>
                        </Default>
                }
            </React.Fragment>
        );
    }
}

export default index;

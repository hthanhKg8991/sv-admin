import React, { Component } from "react";
import List from "pages/CustomerCare/EmployerFreemiumPage/List";
import ListPro from "pages/CustomerCare/EmployerFreemiumPage/ListPro";
import Tab from "components/Common/Ui/Tab";
import Default from "components/Layout/Page/Default";

class index extends Component {
    render() {
        const {history} = this.props;
        const items = [
            {
                title: "Freemium",
                component: <List history={history}/>
            },
            {
                title: "Pro",
                component: <ListPro history={history}/>
            },
        ];

        return (
            <React.Fragment>
                <Default
                    title="Quản lý nhà tuyển dụng Freemium">
                    <Tab items={items} tabActive={0}/>
                </Default>
            </React.Fragment>
        );
    }
}

export default index;

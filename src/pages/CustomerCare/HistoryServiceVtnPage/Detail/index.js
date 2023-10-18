import React from "react";
import List from "./List";

class Index extends React.Component {
    render() {
        const {history} = this.props;
        return <List history={history} />;
    }
}

export default Index;

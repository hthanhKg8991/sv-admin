import React from "react";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";

class FormTextLogo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="col-sm-12 col-xs-12 mb15">
                <MyCKEditor config={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['Link'], ['Source'],[ 'TextColor', 'BGColor' ]]} name="title_show_with_logo" label={"Text hiển thị cùng logo"} showLabelRequired/>
            </div>
        );
    }
}

export default FormTextLogo;

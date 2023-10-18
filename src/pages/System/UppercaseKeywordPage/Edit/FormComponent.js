import React from "react";
import MyField from "components/Common/Ui/Form/MyField";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 0,
        };
        this.onChangeReason = this._onChangeReason.bind(this);
    }

    _onChangeReason(type) {
        const {fnCallBack} = this.props;
        this.setState({
            type,
        }, () => {
            fnCallBack(type);
        })
    }


    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className={"row"}>
                            <div className="col-sm-12 mb10">
                                <MyField name={"keyword"} label={"Từ khóa"} showLabelRequired/>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className="col-sm-12 mb10">
                                <MyField name={"uppercase"} label={"Từ Viết Hoa"} showLabelRequired/>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className="col-sm-12 mb10">
                                <MyField name={"description"} label={"Mô tả"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;

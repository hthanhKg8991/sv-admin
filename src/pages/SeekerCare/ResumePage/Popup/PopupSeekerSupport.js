import React,{Component} from "react";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyField from "components/Common/Ui/Form/MyField";

class PopupSeekerSupport extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div>
                <div className="mb15">
                    <MySelectSystem
                        name={"support_type"}
                        type={"common"}
                        valueField={"value"}
                        label={'Loại hỗ trợ'}
                        showLabelRequired
                        idKey={Constant.COMMON_DATA_KEY_support_type}
                        isClosing={true}
                    />
                </div>
                <div className="mb15">
                    <MyField
                        name={'support_note'}
                        label={'Ghi chú'}
                        showLabelRequired
                    />
                </div>
            </div>
        )
    }
}

export default PopupSeekerSupport;


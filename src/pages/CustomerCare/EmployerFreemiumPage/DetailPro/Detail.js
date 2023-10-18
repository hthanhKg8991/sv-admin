import React from "react";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {asyncApi} from "api";
import {getVsic} from "api/system";
import {bindActionCreators} from "redux";
import {putToastSuccess} from "actions/uiAction";
import {connect} from "react-redux";
import * as utils from "utils/utils";

const ignoreValues = [1]

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.detailId,
            employerId: props.employerId,
            data: null,
            dataVsic: null,
            dataType: null,
            loading: true,
            dataCustomerListNewIgnoreChannelCode: [],
            keysMapping: [
                {key: "company_name"},
                {key: "email"},
                {key: "name"},
                {key: "phone"},
                {key: "fields_activity"},
                {key: "company_size"},
                {key: "tax_code"},
                {key: "type"},
            ],
            mappingField: {
                company_name: 'Tên nhà tuyển dụng',
                email: 'Địa chỉ Email',
                name: 'Tên liên hệ NTD',
                phone: 'Số điện thoại',
                fields_activity: {
                    label: 'Lĩnh vực hoạt động',
                    render: (value) => {
                        const valueConvert = value.split(',').map((item) => parseInt(item))
                        const {dataVsic} = this.state;
                        let element = [];
                        if (valueConvert && Array.isArray(valueConvert)) {
                            valueConvert.map((v) => {
                                const item = _.find(dataVsic, {id: v });
                                
                                element.push(
                                    <React.Fragment key={v}>
                                        <span>- {_.get(item, 'name')}</span>
                                        <br/>
                                    </React.Fragment>
                                );

                                return true;
                            });
                        }

                        return element;
                    }
                },
                company_size: {
                    label: 'Quy mô nhân sự',
                    render: (value) => (
                        value &&
                        <SpanCommon value={value} idKey={Constant.COMMON_DATA_KEY_employer_company_size} notStyle/>
                    )
                },
                tax_code: 'Mã số thuế',
                type: {
                    label: 'Loại tư vấn',
                    render: (value) => {
                        const valueConvert = value.split(',').map((item) => parseInt(item))
                        const {dataType} = this.state;
                        
                        let element = [];
                        if (valueConvert && Array.isArray(valueConvert)) {
                            valueConvert.map((v) => {
                                const item = _.find(dataType, {value: v });

                                if (!ignoreValues.includes(v)){
                                    element.push(
                                        <React.Fragment key={v}>
                                            <span>- {_.get(item, 'title')}</span>
                                            <br/>
                                        </React.Fragment>
                                    );
                                }

                                return true;
                            });
                        }

                        return element;
                    }
                },
            },
            columns: [
                {
                    title: "Trường thông tin",
                    width: 150,
                    accessor: "name"
                },
                {
                    title: "Nội dung",
                    width: 150,
                    accessor: "new"
                },
            ]
        };
        this.convertData = this._convertData.bind(this);
    }

    async asyncData() {
        const res = await asyncApi({
            dataVsic: getVsic(),
        });
        const {dataVsic} = res;
        
        if (dataVsic) {
            this.setState({
                loading: false,
                dataVsic: dataVsic,
            });
        }
    }

    _convertData(data) {
        const {mappingField,keysMapping} = this.state;

        let dataList = [];
        _.forEach(keysMapping, item => {

            const keyToFind = _.get(item, 'key')
            
            const field = _.get(mappingField, keyToFind);
            if (!field) {
                return true;
            }

            const value = _.get(data, keyToFind);
            let name, newData;
            if (_.isObject(field)) {
                const render = _.get(field, 'render');
                name = _.get(field, 'label');
                newData = render(value);
            } else {
                name = field;
                newData = value;
            }

            dataList.push({
                name: name,
                new: newData
            })
        });

        return dataList;
    }

    componentDidMount() {
        this.asyncData();

        const dataType = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_type_register_advise_package_pro);

        this.setState({
            dataType: dataType,
        });
    }

    render() {
        const {columns,loading} = this.state;
        const {history, data} = this.props;

        let dataChangedList = this.convertData(data);

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <React.Fragment>
                <Gird idKey={"HistoryChangedDetail"}
                      data={dataChangedList}
                      columns={columns}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}/>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);

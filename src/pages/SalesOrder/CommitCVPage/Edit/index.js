import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from "query-string";
import {publish, subscribe} from "utils/event";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {createCommitCV, listCommitCV} from "api/employer";
import * as uiAction from "actions/uiAction";
import {formatNumber} from "utils/utils";


class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "province_ids": "province_ids",
                "conditions": "conditions",
            },
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack(id) {
        const {history} = this.props;
        if (id > 0) {
            if (_.get(history, 'action') === 'POP') {
                history.push({
                    pathname: Constant.BASE_URL_COMMIT_CV,
                    search: '?action=list'
                });

                return true;
            }

            if (_.get(history, 'action') === 'PUSH') {
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "list"
                };

                history.push({
                    pathname: Constant.BASE_URL_COMMIT_CV,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_COMMIT_CV
            });
        }

        return true;
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.submitData(dataSumbit, setErrors);
    }

    async submitData(data) {
        const {uiAction, sys} = this.props;
        const {province_ids, conditions} =  data;
        let stringProvince = "";
        sys?.province?.items?.forEach(_=>{
            if(province_ids?.includes(_?.id.toString()) || province_ids?.includes(_?.id)){
                stringProvince += _?.name + ", ";
            }
        })
        stringProvince = stringProvince.substring(0, stringProvince?.length - 2)

        let stringOccupations = "";
        for (const property in conditions) {
            sys?.occupations?.items?.forEach(_=>{
                if(_?.id?.toString() === conditions[property]?.occupation_ids_main){
                    stringOccupations += _?.name + " - " + formatNumber(conditions[property]?.salary_min, 0, ".", " đ") + " ; ";
                }
            })
        }

        stringOccupations = stringOccupations.substring(0, stringOccupations?.length - 2)

        uiAction.SmartMessageBox({
            title: `Bạn có chắc chắn muốn lưu các thông tin này? Khi lưu thành công thì điều kiện sẽ được áp dụng kể từ lúc lưu.`,
            content: <>
                <p>Tỉnh/ thành phố đã chọn: {stringProvince}</p>
                <p>Ngành và lương đã chọn:</p>
                <p style={{overflow: "auto", maxHeight: "10vw"}}>{stringOccupations}</p>
            </>,
            buttons: ['No','Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const {actions} = this.props;
                let res = await createCommitCV(data);
                if (res) {
                    actions.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, this.props.idKey);
                }
                else {
                    actions.putToastError("Có lỗi xảy ra");
                }
                uiAction.hideSmartMessageBox();
                this.setState({loading: false});
            }
        });
    };

    async asyncData() {
        const res = await listCommitCV();
        if (res) {
            this.setState({item: {
                    ...res,
                    province_ids: res?.province_ids?.map((itm) => itm?.province_id)
                }, loading: false});
        }
    }

    componentDidMount() {
        this.asyncData();
    }


    render() {
        const {id, initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            province_ids: Yup.string().required(Constant.MSG_REQUIRED),
            conditions: Yup.string().required(Constant.MSG_REQUIRED),
        });
        const dataForm = utils.initFormValue(initialForm, item);
        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          isEdit={id > 0}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt30"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack(id)}>
                                <span>Quay lại</span>
                            </button>
                        </div>
                    </div>
                </FormBase>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Edit);

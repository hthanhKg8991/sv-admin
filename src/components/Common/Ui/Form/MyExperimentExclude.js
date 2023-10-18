import React from "react";
import PropTypes from "prop-types";
import {FieldArray} from 'formik';
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListExperimentItems, getListExperimentVariantItems} from "api/experiment";
import MySelect from "components/Common/Ui/Form/MySelect";

class MyExperimentExclude extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayValue: Array.from(Array(1).keys()),
            isRender: true,
        };
        this.onChangeExperiment = this._onChangeExperiment.bind(this);
    }

    _onChangeExperiment() {
        this.setState({isRender: false}, () => {
            this.setState({isRender: true});
        });
    }

    render() {
        const {name, values, isEdit} = this.props;
        const {isRender} = this.state;
        const {id} = values;
        const arrayValue = values[name];
        const defaultExp = {status: Constant.STATUS_ACTIVED, per_page: 1000};
        const paramsExp = id > 0 ? {...defaultExp, 'not[id]': id} : defaultExp;
        const isExp = (isEdit && id > 0) || !isEdit;
        return (
            <>
                <FieldArray name={name}>
                    {({remove, push}) => (
                        <div>
                            {arrayValue?.length > 0 &&
                            arrayValue.map((item, index) => {
                                    return (
                                        <div className="row mt20" key={index}>
                                            <div className="col-md-5">
                                                {isExp && (
                                                    <MySelectFetch name={`${name}.${index}.experiment`} label={"Experiment"}
                                                                   fetchApi={getListExperimentItems}
                                                                   fetchField={{value: "id", label: "name"}}
                                                                   fetchFilter={paramsExp}
                                                                   onChange={this.onChangeExperiment}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                {item?.experiment > 0 && isRender ? (
                                                    <MySelectFetch name={`${name}.${index}.experiment_variant`}
                                                                   label={"Experiment Variant"}
                                                                   fetchApi={getListExperimentVariantItems}
                                                                   fetchField={{value: "id", label: "name"}}
                                                                   fetchFilter={{
                                                                       experiment_id: item.experiment,
                                                                       status: Constant.STATUS_ACTIVED,
                                                                       per_page: 1000
                                                                   }}
                                                                   isMulti
                                                    />
                                                ) : (
                                                    <MySelect name={`${name}.${index}.experiment_variant`}
                                                              label={"Experiment Variant"} options={[]}/>
                                                )}
                                                <p className="mt5 fs10"><i>Nếu không chọn experiment variant thì mặc định áp dụng tất cả</i></p>
                                            </div>
                                            <div className="col-md-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => remove(index)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                            <div className="row paddingLeft0 margin-top-10">
                                <div className="col-md-12">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => push(Constant.EXPERIMENT_EXCLUDE_DEFAULT)}
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </FieldArray>
            </>
        )
    }
}

MyExperimentExclude.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
};

export default MyExperimentExclude;

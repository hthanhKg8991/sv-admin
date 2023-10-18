import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MySelect from "components/Common/Ui/Form/MySelect";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import { getConfigForm } from "utils/utils";
import _ from "lodash";
import { connect } from "react-redux";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {
  getDetail,
  getDetailJDTemplate,
  getList as getEmployerList,
  getListJDTemplate,
} from "api/employer";
import { getSkillSuggest } from "api/mix";
import CanAction from "components/Common/Ui/CanAction";
import MyDate from "components/Common/Ui/Form/MyDate";
import moment from "moment";
import MyCloneField from "components/Common/Ui/Form/MyCloneField";
import MyTextField from "components/Common/Ui/Form/MyTextField";
import TagAsync from "components/Common/Ui/Form/TagAsync";
import JobLocations from "./JobLocations";
import queryString from "query-string";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import BtnPopup from "components/Common/Ui/BtnPopup";
import PopupSuggestJobContent from "../Popup/PopupSuggestJobContent";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    const channelCodeCurrent = _.get(
      props,
      "branch.currentBranch.channel_code".split("."),
      null
    );
    this.state = {
      jobLevelList: null,
      // gateList: null,
      configForm: getConfigForm(
        channelCodeCurrent,
        "CustomerCare.JobPage.Form"
      ),
      salaryRangeOld: null,
      checkResetSalary: false,
    };
    this.onChangeJDTemplate = this._onChangeJDTemplate.bind(this);
    this.onChangeCheckboxSalaryAgreeMent =
      this._onChangeCheckboxSalaryAgreeMent.bind(this);
  }

  //  _onChangeLevel(value, isClearField = false) {
  //      if (value) {
  //          const {gateJobLevel, jobLevel, gate} = this.props.sys;
  //          // Lấy gate
  //          const levelCode = jobLevel?.items.find((o) => o.id === value)?.code;
  //          let gateListByJobLevel = gateJobLevel?.items.filter((o) => o.job_level_code === levelCode);
  //          let gateListByJobLevelMap = _.map(gateListByJobLevel, 'gate_code');
  //          let gateList = _.filter(gate.items, function (item) {
  //              return _.includes(gateListByJobLevelMap, item.code)
  //          });
  //          this.setState({
  //              gateList: utils.mapOptionDroplist(gateList, 'full_name', 'code'),
  //          });
  //          if (isClearField) {
  //              this.props.setFieldValue("gate_code", null);
  //          }
  //      } else {
  //          this.setState({
  //              gateList: null,
  //              occupationMainList: null,
  //              jobFieldSubList: null
  //          });
  //      }
  //  }

  async _onChangeEmployerFillContact(id) {
    const { setFieldValue } = this.props;
    const res = await getDetail(id);
    if (res) {
      const { contact_info } = res;
      setFieldValue("contact_name", contact_info?.contact_name);
      setFieldValue("contact_email", contact_info?.contact_email);
      setFieldValue("contact_address", contact_info?.contact_address);
      setFieldValue("contact_phone", contact_info?.contact_phone);
    }
  }

  async _onChangeJDTemplate(value) {
    const { setFieldValue } = this.props;
    const res = await getDetailJDTemplate({ id: value });
    if (res) {
      const { description, requirements } = res;
      setFieldValue("description", description);
      setFieldValue("job_requirement", requirements);
      setFieldValue("other_requirement", requirements);
    }
  }

  _onChangeCheckboxSalaryAgreeMent(e) {
    const { setFieldValue } = this.props;
    const isChecked = e.target.checked;

    if (isChecked) {
      setFieldValue("salary_range", Constant.SALARY_RANGE_AGREE);
    } else {
      setFieldValue("salary_range", Constant.SALARY_RANGE_CUSTOM);
    }
  }

  componentDidMount() {
    let { values, isEdit, setFieldValue } = this.props;
    //   if (values?.level_requirement) {
    //       this._onChangeLevel(values?.level_requirement);
    //   }
    if (values?.employer_id && !isEdit) {
      this._onChangeEmployerFillContact(values?.employer_id);
    }
  }

  componentWillReceiveProps(newProps) {
    const { values } = newProps;
    const { branch, isEdit } = this.props;
    const channel_code = branch.currentBranch.channel_code;
    const isChangeGate = channel_code === Constant.CHANNEL_CODE_VL24H;
    //   if (!_.isEqual(values?.level_requirement, this.props.values?.level_requirement)) {
    //       if (values?.level_requirement && isChangeGate) {
    //           this._onChangeLevel(values?.level_requirement);
    //       }
    //   }

    if (
      values?.level_requirement !== Constant.LEVEL_HIGH_UP &&
      values?.salary_range !== Constant.SALARY_RANGE_CUSTOM
    ) {
      this.props.setFieldValue("salary_range", Constant.SALARY_RANGE_CUSTOM);
      this.props.setFieldValue("salary_min", null);
      this.props.setFieldValue("salary_max", null);
    }

    if (
      !_.isEqual(values?.employer_id, this.props.values?.employer_id) &&
      !isEdit
    ) {
      this._onChangeEmployerFillContact(values?.employer_id);
    }
  }

  render() {
    const {
      fieldWarnings,
      values,
      isEdit,
      errors,
      setFieldError,
      branch,
      setFieldValue,
    } = this.props;
    const { configForm } = this.state;
    const { level_requirement, salary_range } = values;
    const channel_code = branch.currentBranch.channel_code;
    // #CONFIG_BRANCH

    // Define options mức lương khác
    // Map mức lương bên ats
    const maxSalary = 100;
    let optionSalary = [];
    for (let i = 1; i <= maxSalary; i++) {
      optionSalary = [
        ...optionSalary,
        {
          label: `${i} triệu`,
          value: i * 1000000,
        },
      ];
    }
    let query = queryString.parse(window.location.search);
    let isCoppy = query?.copy_id > 0;
    return (
      <React.Fragment>
        <div className={"row"}>
          <div className="col-sm-12 sub-title-form mb10">
            <span>Thông tin chung</span>
          </div>
        </div>
        <div className={"row"}>
          <div className="col-sm-12 mb10">
            <CanAction isDisabled={isEdit}>
              <MySelectSearch
                name={"employer_id"}
                label={"Nhà tuyển dụng"}
                searchApi={getEmployerList}
                isWarning={_.includes(fieldWarnings, "employer_id")}
                initKeyword={values?.employer_id}
                optionField={"email"}
                showLabelRequired
              />
            </CanAction>
          </div>
        </div>
        <div className={"row"}>
          <div className="col-sm-12 mb10">
            <MyField
              name={"title"}
              label={"Tiêu đề"}
              isWarning={_.includes(fieldWarnings, "title")}
              showLabelRequired
            />
          </div>
        </div>
        <div className={"row"}>
          {_.includes(configForm, "level_requirement") && (
            <div className="col-sm-12 mb10">
              <MySelectSystem
                name={"level_requirement"}
                label={"Cấp bậc"}
                type={"jobLevel"}
                labelField={"name"}
                valueField={"id"}
                isWarning={_.includes(fieldWarnings, "level_requirement")}
                isClosing
                showLabelRequired
              />
            </div>
          )}
          {_.includes(configForm, "level_requirement_mw") && (
            <div className="col-sm-12 mb10">
              <MySelectSystem
                name={"level_requirement"}
                label={"Cấp bậc"}
                type={"common"}
                valueField={"value"}
                idKey={Constant.COMMON_DATA_KEY_job_level_requirement}
                isWarning={_.includes(fieldWarnings, "level_requirement")}
              />
            </div>
          )}
          {/* {_.includes(configForm, "gate_code") &&
                        <div className="col-sm-6 mb10">
                            <MySelect name={"gate_code"} label={"Cổng"}
                                      options={gateList || []}
                                      isWarning={_.includes(fieldWarnings, 'gate_code')}
                                      isClosing
                            />
                        </div>
                    } */}
        </div>
        <div className={"row"}>
          <div className="col-sm-12 mb10">
            <MySelectSystem
              name={"occupation_ids_main"}
              label={"Nghề nghiệp"}
              type={"occupations"}
              isMulti
              isWarning={_.includes(fieldWarnings, "occupation_ids_main")}
              showLabelRequired
            />
          </div>
        </div>
        {isEdit && values.is_merge_occupation && (
          <div className={"row"}>
            <div className="col-sm-6 mb10">
              <MySelectSystem
                name={"field_ids_main"}
                label={"Ngành chính"}
                type={"jobField"}
                isMulti
                readOnly
                showLabelRequired
              />
            </div>
            <div className="col-sm-6 mb10">
              <MySelectSystem
                name={"field_ids_sub"}
                label={"Ngành phụ"}
                type={"jobField"}
                isMulti
                readOnly
                showLabelRequired
              />
            </div>
          </div>
        )}
        {((values?.id && (isEdit || isCoppy)) || (!isEdit && !isCoppy)) && (
          <div className="row">
            <JobLocations
              values={values}
              name={"places"}
              label={"Địa chỉ"}
              setFieldValue={setFieldValue}
              fieldWarnings={fieldWarnings}
              errors={errors}
              setFieldError={setFieldError}
              provinceList={this.props.sys.provinceInForm.items}
              districtList={this.props.sys.districtActive.items}
            />
          </div>
        )}

        <div className={"row"}>
          {/* <div className="col-sm-6 mb10">
                        <MySelectSystem name={"province_ids"} label={"Tỉnh/ thành phố"}
                                        type={"provinceInForm"}
                                        isMulti
                                        isWarning={_.includes(fieldWarnings, 'province_ids')}
                                        showLabelRequired/>
                    </div> */}
          <div className="col-sm-6 mb10">
            <MyField
              name={"vacancy_quantity"}
              label={"Số lượng cần tuyển"}
              isWarning={_.includes(fieldWarnings, "vacancy_quantity")}
              showLabelRequired
            />
          </div>
        </div>

        <div className="row mb10">
          {level_requirement === Constant.LEVEL_HIGH_UP && (
            <div className="col-md-6">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      values.salary_range === Constant.SALARY_RANGE_AGREE
                    }
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                    checkedIcon={<CheckBoxIcon fontSize="large" />}
                    onChange={(e) => this.onChangeCheckboxSalaryAgreeMent(e)}
                  />
                }
                label={
                  <label className="v-label pt5">
                    Lương thoả thuận cho vị trí này
                  </label>
                }
              />
            </div>
          )}
        </div>
        {(!salary_range || salary_range !== Constant.SALARY_RANGE_AGREE) && (
          <div className={"row"}>
            <div className="col-md-6 mb10">
              <MyField
                name={"salary_min"}
                label={"Mức lương tối thiểu (triệu)"}
                isWarning={_.includes(fieldWarnings, "salary_min")}
                showLabelRequired
                disabled={salary_range === Constant.SALARY_RANGE_AGREE}
              />
            </div>

            <div className="col-md-6 mb10">
              <MyField
                name={"salary_max"}
                label={"Mức lương tối đa (triệu)"}
                isWarning={_.includes(fieldWarnings, "salary_max")}
                showLabelRequired
                disabled={salary_range === Constant.SALARY_RANGE_AGREE}
              />
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-sm-6 mb10">
            <MySelectSystem
              name={"working_method"}
              label={"Hình thức làm việc"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_job_working_method}
              isWarning={_.includes(fieldWarnings, "working_method")}
              isClosing
              showLabelRequired
            />
          </div>
        </div>
        <div className={"row"}>
          <div className="col-sm-6 mb10">
            <MyDate
              name={"resume_apply_expired"}
              label={"Hạn nộp hồ sơ"}
              isWarning={_.includes(fieldWarnings, "resume_apply_expired")}
              minDate={moment()}
              showLabelRequired
            />
          </div>
          {_.includes(configForm, "probation_duration") && (
            <div className="col-sm-6 mb10">
              <MySelectSystem
                name={"probation_duration"}
                label={"Thời gian thử việc"}
                type={"common"}
                valueField={"value"}
                idKey={Constant.COMMON_DATA_KEY_job_probation_duration}
                isWarning={_.includes(fieldWarnings, "probation_duration")}
              />
            </div>
          )}
          {_.includes(configForm, "probation_duration_text") && (
            <div className="col-sm-6 mb10">
              <MyField
                name={"probation_duration_text"}
                label={"Thời gian thử việc"}
                isWarning={_.includes(fieldWarnings, "probation_duration_text")}
                //  showLabelRequired
              />
            </div>
          )}
        </div>
        <div className={"row"}>
          <div className="col-md-6 mb10">
            <MyField
              name={"age_min"}
              label={"Độ tuổi tối thiểu (tuổi)"}
              isWarning={_.includes(fieldWarnings, "age_min")}
            />
          </div>
          <div className="col-md-6 mb10">
            <MyField
              name={"age_max"}
              label={"Độ tuổi tối đa (tuổi)"}
              isWarning={_.includes(fieldWarnings, "age_max")}
            />
          </div>
        </div>
        <div className={"row"}>
          <div className="col-sm-6 mb10">
            <div className={"row"}>
              <div className="col-sm-6 mb10">
                <MyField
                  name={"commission_from"}
                  label={"Hoa hồng"}
                  isWarning={_.includes(fieldWarnings, "commission_from")}
                />
              </div>
              <div className="col-sm-6 mb10 mt10">
                <MyField
                  name={"commission_to"}
                  label={""}
                  isWarning={_.includes(fieldWarnings, "commission_to")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6 mb10">
            <TagAsync
              name={"skills_new"}
              label={"Kỹ năng cần thiết"}
              valueField={"value"}
              apiRequest={getSkillSuggest}
              isWarning={_.includes(fieldWarnings, "skills_new")}
              max={10}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 mb10">
            <MySelectSearch
              name={"jd_template_id"}
              label={"Chọn JD template điền nhanh"}
              labelField={"title"}
              searchApi={getListJDTemplate}
              defaultQuery={{ status: Constant.STATUS_ACTIVED }}
              onChange={this.onChangeJDTemplate}
            />
          </div>
        </div>

        <div className={"row"}>
          <div className="col-sm-12 mb10">
            {channel_code === Constant.CHANNEL_CODE_VL24H ? (
              <MyTextField
                label={"Mô tả công việc"}
                name="description"
                showLabelRequired
              />
            ) : (
              <MyField
                name={"description"}
                label={"Mô tả công việc"}
                isWarning={_.includes(fieldWarnings, "description")}
                multiline
                rows={15}
                showLabelRequired
              />
            )}
          </div>
          <div className="col-md-12 mb20">
            <BtnPopup
              label={"Xem gợi ý mô tả công việc"}
              className={"btn-suggestion"}
              Component={PopupSuggestJobContent}
              title={`Xem gợi ý mô tả công việc`}
              icon={"glyphicon glyphicon-question-sign"}
              params={{
                values,
                setFieldValue,
                suggestInput: "description",
              }}
            />
          </div>
        </div>

        <div className={"row"}>
          <div className="col-sm-12 mb10">
            {channel_code === Constant.CHANNEL_CODE_VL24H ? (
              <MyTextField
                label={"Quyền lợi"}
                name="benefit"
                showLabelRequired
              />
            ) : (
              <MyField
                name={"benefit"}
                label={"Quyền lợi"}
                isWarning={_.includes(fieldWarnings, "benefit")}
                multiline
                rows={15}
                showLabelRequired
              />
            )}
          </div>
          <div className="col-md-12 mb20">
            <BtnPopup
              label={"Xem gợi ý quyền lợi"}
              className={"btn-suggestion"}
              Component={PopupSuggestJobContent}
              title={`Xem gợi ý quyền lợi`}
              icon={"glyphicon glyphicon-question-sign"}
              params={{
                values,
                setFieldValue,
                suggestInput: "benefit",
              }}
            />
          </div>
        </div>

        <div className={"row"}>
          <div className="col-sm-12 mb10">
            {_.includes(configForm, "other_requirement") &&
              (channel_code === Constant.CHANNEL_CODE_VL24H ? (
                <MyTextField
                  label={"Yêu cầu khác"}
                  name="other_requirement"
                  showLabelRequired
                />
              ) : (
                <MyField
                  name={"other_requirement"}
                  label={"Yêu cầu khác"}
                  isWarning={_.includes(fieldWarnings, "other_requirement")}
                  multiline
                  rows={15}
                />
              ))}
            {_.includes(configForm, "job_requirement") && (
              <MyField
                name={"job_requirement"}
                label={"Yêu cầu công việc"}
                isWarning={_.includes(fieldWarnings, "job_requirement")}
                multiline
                rows={15}
                showLabelRequired
              />
            )}
          </div>
          <div className="col-md-12 mb20">
            <BtnPopup
              label={"Xem gợi ý yêu cầu khác"}
              className={"btn-suggestion"}
              Component={PopupSuggestJobContent}
              title={`Xem gợi ý yêu cầu khác`}
              icon={"glyphicon glyphicon-question-sign"}
              params={{
                values,
                setFieldValue,
                suggestInput: "other_requirement",
              }}
            />
          </div>
        </div>

        {_.includes(configForm, "attribute") && (
          <div className="row">
            <div className="col-sm-6 mb10">
              <MySelectSystem
                name={"attribute"}
                label={"Tính chất công việc"}
                type={"common"}
                valueField={"value"}
                idKey={Constant.COMMON_DATA_KEY_job_attribute}
                isWarning={_.includes(fieldWarnings, "attribute")}
                showLabelRequired
              />
            </div>
          </div>
        )}

        <div className={"row"}>
          <div className="col-sm-12 sub-title-form mb10">
            <span>Yêu cầu</span>
          </div>
        </div>
        <div className={"row"}>
          <div className="col-sm-6 mb10">
            <MySelectSystem
              name={"degree_requirement"}
              label={"Bằng cấp"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_job_degree_requirement}
              isWarning={_.includes(fieldWarnings, "degree_requirement")}
              showLabelRequired
              isClosing
            />
          </div>
          <div className="col-sm-6 mb10">
            <MySelectSystem
              name={"gender"}
              label={"Giới tính"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_job_gender}
              isWarning={_.includes(fieldWarnings, "gender")}
              showLabelRequired
              isClosing
            />
          </div>
        </div>

        <div className={"row"}>
          <div className="col-sm-6 mb10">
            <MySelectSystem
              name={"experience_range"}
              label={"Kinh nghiệm"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_job_experience_range}
              isWarning={_.includes(fieldWarnings, "experience_range")}
              showLabelRequired
              isClosing
            />
          </div>
        </div>
        {_.includes(configForm, "language_requirement") && (
          <div className={"row"}>
            <div className="col-sm-6 mb10">
              <MySelectSystem
                name={"language_requirement"}
                label={"Ngôn ngữ hồ sơ"}
                type={"common"}
                valueField={"value"}
                idKey={Constant.COMMON_DATA_KEY_language_requirement}
                isWarning={_.includes(fieldWarnings, "language_requirement")}
                showLabelRequired
                isClosing
              />
            </div>
          </div>
        )}
        <div className={"row"}>
          <div className="col-sm-12 sub-title-form mb10">
            <span>Liên hệ</span>
          </div>
        </div>
        <div className={"row"}>
          <div className="col-sm-6 mb10">
            <MyField
              name={"contact_name"}
              label={"Tên người liên hệ"}
              showLabelRequired
            />
          </div>
          <div className="col-sm-6 mb10">
            <MyField
              name={"contact_email"}
              label={"Email liên hệ"}
              showLabelRequired
            />
          </div>
        </div>
        <div className={"row"}>
          <div className="col-sm-6 mb10">
            <MyCloneField
              errors={errors}
              setFieldError={setFieldError}
              value={values?.contact_phone || [""]}
              name="contact_phone"
              label={"Số điện thoại liên hệ"}
            />
          </div>
          <div className="col-sm-6 mb10">
            <MyField
              name={"contact_address"}
              label={"Địa chỉ liên hệ"}
              showLabelRequired
            />
          </div>
        </div>
        <style>{`
        .flag-error .ql-editor {
          color: #303133;
        }

        .btn-suggestion {
          color: #2C95FF;
          font-weight: bold;
          font-size:14px;
          border: none;
          padding: 2px;
        }
        `}</style>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    sys: state.sys,
    branch: state.branch,
  };
}

export default connect(mapStateToProps, null)(FormComponent);

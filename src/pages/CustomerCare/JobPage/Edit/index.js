import React from "react";
import { add, getDetail as getJobDetail, getRevision, update } from "api/job";
import * as Constant from "utils/Constant";
import _ from "lodash";
import { subscribe } from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import { getConfigForm, getMergeDataRevision } from "utils/utils";
import { putToastError, putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { asyncApi } from "api";
import { connect } from "react-redux";
import queryString from "query-string";

class Edit extends React.Component {
  constructor(props) {
    super(props);
    const channelCodeCurrent = _.get(
      props,
      "branch.currentBranch.channel_code".split("."),
      null
    );
    this.state = {
      id: props.id,
      job: null,
      jobRevision: null,
      loading: true,
      initialForm: {
        id: "id",
        title: "title",
        employer_id: "employer_id",
        //  gate_code: "gate_code",
        level_requirement: "level_requirement",
        field_ids_main: "field_ids_main",
        field_ids_sub: "field_ids_sub",
        occupation_ids_main: "occupation_ids_main",
        // province_ids: "province_ids",
        vacancy_quantity: "vacancy_quantity",
        salary_range: "salary_range",
        salary_min: "salary_min",
        salary_max: "salary_max",
        working_method: "working_method",
        resume_apply_expired: "resume_apply_expired",
        probation_duration: "probation_duration",
        probation_duration_text: "probation_duration_text",
        age_range: "age_range",
        age_min: "age_min",
        age_max: "age_max",
        commission_from: "commission_from",
        commission_to: "commission_to",
        description: "description",
        benefit: "benefit",
        other_requirement: "other_requirement",
        degree_requirement: "degree_requirement",
        gender: "gender",
        experience_range: "experience_range",
        resume_requirement: "resume_requirement",
        job_requirement: "job_requirement",
        attribute: "attribute",
        contact_name: "job_contact_info.contact_name",
        contact_email: "job_contact_info.contact_email",
        contact_phone: "job_contact_info.contact_phone",
        contact_address: "job_contact_info.contact_address",
        language_requirement: "language_requirement",
        skills_new: "skills_new",
        places: "places",
      },
      configForm: getConfigForm(
        channelCodeCurrent,
        "CustomerCare.JobPage.Form"
      ),
    };

    this.subscribers = [];
    this.subscribers.push(
      subscribe(
        ".refresh",
        (msg) => {
          this.setState({ loading: true }, () => {
            this.asyncData();
          });
        },
        props.idKey
      )
    );

    this.onSubmit = this._onSubmit.bind(this);
    this.goBack = this._goBack.bind(this);
  }

  _goBack(id) {
    const { history } = this.props;
    if (id > 0) {
      if (_.get(history, "action") === "POP") {
        history.push({
          pathname: Constant.BASE_URL_JOB,
          search: "?action=detail&id=" + id,
        });

        return true;
      }

      if (_.get(history, "action") === "PUSH") {
        const search = queryString.parse(
          _.get(history, ["location", "search"])
        );
        const params = {
          ...search,
          action: "detail",
        };

        history.push({
          pathname: Constant.BASE_URL_JOB,
          search: "?" + queryString.stringify(params),
        });

        return true;
      }
    } else {
      history.push({
        pathname: Constant.BASE_URL_JOB,
      });
    }

    return true;
  }

  _onSubmit(data, action) {
    // filter loại bỏ tỉnh thành đặc biệt trước khi submit
    // const province_list = this.props.sys.provinceInForm.items;
    // const province = province_list.filter(_ => data.province_ids?.indexOf(_?.id) > -1);
    const { setErrors } = action;
    const { actions } = this.props;
    // if(province?.length === 0){
    //     setErrors({"province_ids": "Vui lòng chọn Tỉnh/Thành phố"})
    //     return false;
    // }
    const dataSumbit = _.pickBy(data, (item, key) => {
      return !_.isUndefined(item);
    });

    if (!data.places || data.places.length === 0) {
      actions.putToastError("Vui lòng nhập địa điểm làm việc");
      return;
    }

    const newPlace = data.places.map((place) => {
      return {
        province_id: place.province_id,
        district_id: place.district_id,
        address: place.address,
      };
    });
    data.places = newPlace;

    this.setState({ loading: true }, () => {
      this.submitData(dataSumbit, setErrors);
    });
  }

  async submitData(dataForm, setErrors) {
    const { id, job, jobRevision } = this.state;
    const { actions, history, branch } = this.props;
    const dataMerge = getMergeDataRevision(job, jobRevision);
    let res;

    //triệu VND => VND

    dataForm.salary_min = dataForm.salary_min
      ? dataForm.salary_min * 1000000
      : null;
    dataForm.salary_max = dataForm.salary_max
      ? dataForm.salary_max * 1000000
      : null;
    dataForm.salary_range =
      dataForm.salary_range || Constant.SALARY_RANGE_CUSTOM;
    dataForm.age_range = "";
    dataForm.age_min = +dataForm.age_min;
    dataForm.age_max = +dataForm.age_max;

    if (id > 0) {
      dataForm.id = id;
      /** parseInt params when POST data form **/
      dataForm.vacancy_quantity = Number(dataForm.vacancy_quantity);
      dataForm.probation_duration = Number(dataForm.probation_duration);

      res = await update(dataForm);
    } else {
      res = await add(dataForm);
    }
    if (res) {
      const { data, code, msg } = res;
      if (code === Constant.CODE_SUCCESS) {
        actions.putToastSuccess("Thao tác thành công!");
        if (data.id) {
          history.push({
            pathname: Constant.BASE_URL_JOB,
            search: "?action=detail&id=" + data.id,
          });
        } else {
          history.push({
            pathname: Constant.BASE_URL_JOB,
          });
        }
      } else {
        setErrors(data);
        actions.putToastError(
          code === Constant.CODE_SQL_ERROR
            ? "Nội dung tin đang chứa ký tự đặc biệt. Vui lòng cập nhật lại nội dung"
            : msg
        );
      }
    }
    this.setState({ loading: false });
  }

  async asyncData() {
    const { id } = this.state;
    const { query } = this.props;
    const copyId = query?.copy_id;
    if (id > 0 || copyId) {
      const idFetch = id > 0 ? id : copyId;
      const res = await asyncApi({
        data: getJobDetail(idFetch),
        dataRevision: getRevision(idFetch),
      });
      const { data, dataRevision } = res;
      if (data && dataRevision) {
        // pickBy không check object con
        dataRevision.id = null;
        dataRevision.job_contact_info = _.pickBy(
          _.get(dataRevision, "job_contact_info", {}),
          (item) => {
            return !_.isUndefined(item) && !_.isNull(item);
          }
        );

        this.setState({
          loading: false,
          job: data,
          jobRevision: _.pickBy(dataRevision, (item) => {
            return !_.isUndefined(item) && !_.isNull(item);
          }),
        });
      }
    } else {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    const { id } = this.state;
    const { query } = this.props;
    const copyId = query?.copy_id;
    if (id > 0 || copyId) {
      this.asyncData();
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const { id, initialForm, job, jobRevision, configForm, loading } =
      this.state;
    const { query, branch, sys } = this.props;
    const data = getMergeDataRevision(job, jobRevision);
    let fieldWarnings = [];
    _.forEach(jobRevision, (item, key) => {
      if (!_.isEqual(item, _.get(job, key))) {
        fieldWarnings.push(key);
      }
    });

    // VND => triệu VND
    data.salary_min = data?.salary_min ? +data.salary_min / 1000000 : null;
    data.salary_max = data?.salary_max ? +data.salary_max / 1000000 : null;
    data.age_max = +data?.age_max === 0 ? null : data?.age_max;
    data.age_min = +data?.age_min === 0 ? null : data?.age_min;

    let object_validation = {
      title: Yup.string()
        .required(Constant.MSG_REQUIRED)
        .min(5, Constant.MSG_MIN_CHARATER_5)
        .max(255, Constant.MSG_MAX_CHARATER_255)
        .nullable(),
      occupation_ids_main: Yup.array()
        .required(Constant.MSG_REQUIRED)
        .max(3, Constant.MSG_MAX_ARRAY_3_ITEM)
        .nullable(),
      // province_ids: Yup.array().required(Constant.MSG_REQUIRED).max(5, Constant.MSG_MAX_ARRAY_ITEM).nullable(),
      vacancy_quantity: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      // salary_range: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      working_method: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      resume_apply_expired: Yup.number()
        .required(Constant.MSG_REQUIRED)
        .nullable(),
      description: Yup.string()
        .required(Constant.MSG_REQUIRED)
        .min(100, Constant.MSG_MIN_CHARATER_100)
        .nullable(),
      benefit: Yup.string()
        .required(Constant.MSG_REQUIRED)
        .min(100, Constant.MSG_MIN_CHARATER_100)
        .nullable(),
      degree_requirement: Yup.number()
        .required(Constant.MSG_REQUIRED)
        .nullable(),
      gender: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      experience_range: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      contact_name: Yup.string()
        .required(Constant.MSG_REQUIRED)
        .min(5, Constant.MSG_MIN_CHARATER_5)
        .max(255, Constant.MSG_MAX_CHARATER_255)
        .nullable(),
      contact_email: Yup.string()
        .required(Constant.MSG_REQUIRED)
        .min(5, Constant.MSG_MIN_CHARATER_5)
        .max(255, Constant.MSG_MAX_CHARATER_255)
        .nullable(),
      contact_phone: Yup.array().of(
        Yup.string()
          .min(10, Constant.MSG_MIN_CHARATER_10)
          .required(Constant.MSG_REQUIRED)
      ),
      contact_address: Yup.string()
        .required(Constant.MSG_REQUIRED)
        .min(5, Constant.MSG_MIN_CHARATER_5)
        .max(255, Constant.MSG_MAX_CHARATER_255)
        .nullable(),
      places: Yup.array().of(
        Yup.object().shape({
          province_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
          district_id: Yup.number()
            .when("province_id", {
              is: (v) => v && v !== 140, // 140 nước ngoài
              then: (schema) => schema.required(Constant.MSG_REQUIRED),
            })
            .nullable(),
          address: Yup.string()
            .min(5, Constant.MSG_MIN_CHARATER_5)
            .max(100, Constant.MSG_MAX_CHARATER_DYNAMIC(100))
            .nullable(),
        })
      ),
      salary_min: Yup.number()
        .typeError(Constant.MSG_NUMBER_ONLY)
        .positive(Constant.MSG_POSITIVE_ONLY)
        .max(999, Constant.MSG_MAX_NUMBER_VALUE_DYNAMIC(999))
        .lessThan(
          Yup.ref("salary_max"),
          "Mức lương tối thiểu phải nhỏ hơn mức lương tối đa"
        )
        .when("salary_range", {
          is: (v) => !v || +v !== +Constant.SALARY_RANGE_AGREE,
          then: (schema) => schema.required(Constant.MSG_REQUIRED),
        })
        .nullable(),
      salary_max: Yup.number()
        .typeError(Constant.MSG_NUMBER_ONLY)
        .positive(Constant.MSG_POSITIVE_ONLY)
        .max(999, Constant.MSG_MAX_NUMBER_VALUE_DYNAMIC(999))
        .moreThan(
          Yup.ref("salary_min"),
          "Mức lương tối đa phải lớn hơn mức lương tối thiểu"
        )
        .when("salary_range", {
          is: (v) => !v || +v !== +Constant.SALARY_RANGE_AGREE,
          then: (schema) => schema.required(Constant.MSG_REQUIRED),
        })
        .nullable(),
      age_min: Yup.number()
        .typeError(Constant.MSG_NUMBER_ONLY)
        .min(15, Constant.MSG_MIN_NUMBER_VALUE_DYNAMIC(15))
        .max(60, Constant.MSG_MAX_NUMBER_VALUE_DYNAMIC(60))
        .lessThan(
          Yup.ref("age_max"),
          "Độ tuổi tối thiểu phải nhỏ hơn độ tuổi tối đa"
        )
        .nullable()
        .when("age_max", {
          is: (v) => v,
          then: (schema) => schema.required(Constant.MSG_REQUIRED),
        })
        .nullable(),
      age_max: Yup.number()
        .typeError(Constant.MSG_NUMBER_ONLY)
        .min(15, Constant.MSG_MIN_NUMBER_VALUE_DYNAMIC(15))
        .max(60, Constant.MSG_MAX_NUMBER_VALUE_DYNAMIC(60))
        .moreThan(
          Yup.ref("age_min"),
          "Độ tuổi tối đa phải lớn hơn độ tuổi tối thiểu"
        )
        .nullable(),
    };

    const channel_code = branch.currentBranch.channel_code;
    /**
     * Config validate of channel
     */
    if (configForm.includes("level_requirement")) {
      object_validation = {
        ...object_validation,
        level_requirement: Yup.number()
          .required(Constant.MSG_REQUIRED)
          .nullable(),
      };
    }
    // if(configForm.includes("gate_code")) {
    //     object_validation = {
    //         ...object_validation,
    //         gate_code: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
    //     }
    // }
    if (configForm.includes("job_requirement")) {
      object_validation = {
        ...object_validation,
        job_requirement: Yup.string()
          .required(Constant.MSG_REQUIRED)
          .nullable(),
      };
    }
    if (configForm.includes("attribute")) {
      object_validation = {
        ...object_validation,
        attribute: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
      };
    }
    if (configForm.includes("attribute")) {
      object_validation = {
        ...object_validation,
        attribute: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
      };
    }
    if (configForm.includes("language_requirement")) {
      object_validation = {
        ...object_validation,
        language_requirement: Yup.number()
          .required(Constant.MSG_REQUIRED)
          .nullable(),
      };
    }

    let initForm = job
      ? utils.initFormValue(initialForm, {
          ...data,
          other_requirement:
            channel_code == Constant.CHANNEL_CODE_VL24H &&
            !data?.other_requirement
              ? data?.job_requirement
              : data?.other_requirement,
        })
      : utils.initFormKey(initialForm);

    // Nhà tuyển dụng nếu có params này chỉ đc tạo riêng cho nó
    initForm.contact_phone = Array.isArray(initForm.contact_phone)
      ? initForm.contact_phone
      : [""];
    initForm.places = Array.isArray(initForm.places)
      ? initForm.places
      : [{ province_id: null, district_id: null, address: "" }];
    //occupation
    initForm.is_merge_occupation = !jobRevision?.occupation_ids_main;
    initForm.field_ids_main = Array.isArray(initForm?.field_ids_main)
      ? initForm?.field_ids_main
      : [initForm?.field_ids_main];
    initForm.field_ids_sub = Array.isArray(initForm?.field_ids_sub)
      ? initForm?.field_ids_sub
      : [];

    // Copy tin sẽ set null chot tiêu đề tin
    if (Number(id) === 0 && query?.copy_id > 0) {
      initForm.title = null;
    }

    // Fill tự động NTD khi click tạo tin trang NTD
    if (query?.employer_create) {
      initForm.employer_id = query.employer_create;
    }

    // Thiết lập giá trị default cho resume_requirement
    if (!job?.resume_requirement) {
      initForm = {
        ...initForm,
        resume_requirement: Constant.RESUME_APPLY_TEXT_DEFAULT[channel_code],
      };
    }

    // Khi tạo mới tin validate bắt buộc chọn NTD
    if (parseInt(id) === 0) {
      object_validation = _.merge(object_validation, {
        employer_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      });
    }

    const validationSchema = Yup.object().shape(object_validation);
    // Kiểm tra đủ system mới cho render
    const { gateJobField, gateJobLevel, gate } = sys;
    const isRenderForm =
      !!gateJobField?.items && !!gateJobLevel?.items && !!gate?.items;
    return (
      <div className="form-container">
        {(loading || !isRenderForm) && (
          <LoadingSmall className="form-loading" />
        )}

        {isRenderForm && (
          <FormBase
            onSubmit={this.onSubmit}
            isEdit={Number(id) > 0}
            initialValues={initForm}
            validationSchema={validationSchema}
            fieldWarnings={fieldWarnings}
            FormComponent={FormComponent}
          >
            <div className={"row mt15"}>
              <div className="col-sm-12">
                <button
                  type="submit"
                  className="el-button el-button-success el-button-small"
                >
                  <span>Lưu</span>
                </button>
                <button
                  type="button"
                  className="el-button el-button-default el-button-small"
                  onClick={() => this.goBack(id)}
                >
                  <span>Quay lại</span>
                </button>
              </div>
            </div>
          </FormBase>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sys: state.sys,
    branch: state.branch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess, putToastError }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);

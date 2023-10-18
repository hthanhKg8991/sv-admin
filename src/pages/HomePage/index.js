import React, {Component} from "react";
import AdminStorage from "utils/storage";
import ModalSurveyLink from "pages/HomePage/ModalSurveyLink";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {Link} from "react-router-dom";
import * as Constant from "utils/Constant";
class index extends Component {
    constructor(props) {
        super(props);
        this.onChange = this._onChange.bind();
    }

    _onChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        AdminStorage.setItem(name, value);
    }

    render() {
        const isDevMode = process.env.NODE_ENV;
        const isDebug = AdminStorage.getItem("debug_api");
        const apiEmployerDomain = (isDevMode && AdminStorage.getItem("api_employer") ? AdminStorage.getItem("api_employer") : process.env.REACT_APP_SV_EMPLOYER_URL);
        const apiSystemDomain = (isDevMode && AdminStorage.getItem("api_system") ? AdminStorage.getItem("api_system") : process.env.REACT_APP_SV_SYSTEM_URL);
        const apiAuthDomain = (isDevMode && AdminStorage.getItem("api_auth") ? AdminStorage.getItem("api_auth") : process.env.REACT_APP_SV_AUTH_URL);
        const apiBookingDomain = (isDevMode && AdminStorage.getItem("api_booking") ? AdminStorage.getItem("api_booking") : process.env.REACT_APP_SV_BOOKING_URL);
        const apiSalesOrderDomain = (isDevMode && AdminStorage.getItem("api_sales_order") ? AdminStorage.getItem("api_sales_order") : process.env.REACT_APP_SV_SALES_ORDER_URL);
        const apiPlanDomain = (isDevMode && AdminStorage.getItem("api_plan") ? AdminStorage.getItem("api_plan") : process.env.REACT_APP_SV_PLAN_URL);
        const apiStatisticDomain = (isDevMode && AdminStorage.getItem("api_statistic") ? AdminStorage.getItem("api_statistic") : process.env.REACT_APP_SV_STATISTIC_URL);
        const apiCallDomain = (isDevMode && AdminStorage.getItem("api_call") ? AdminStorage.getItem("api_call") : process.env.REACT_APP_SV_CALL_URL);
        const apiCdnDomain = (isDevMode && AdminStorage.getItem("api_cdn") ? AdminStorage.getItem("api_cdn") : process.env.REACT_APP_SV_CDN_URL);
        const apiSeekerDomain = (isDevMode && AdminStorage.getItem("api_seeker") ? AdminStorage.getItem("api_seeker") : process.env.REACT_APP_SV_SEEKER_URL);
        const apiResumeDomain = (isDevMode && AdminStorage.getItem("api_seeker") ? AdminStorage.getItem("api_seeker") : process.env.REACT_APP_SV_SEEKER_URL);
        const apiPrintDomain = (isDevMode && AdminStorage.getItem("api_print") ? AdminStorage.getItem("api_print") : process.env.REACT_APP_SV_PRINT_URL);
        const apiArticleDomain = (isDevMode && AdminStorage.getItem("api_article") ? AdminStorage.getItem("api_article") : process.env.REACT_APP_SV_ARTICLE_URL);
        const apiSearchDomain = (isDevMode && AdminStorage.getItem("api_search") ? AdminStorage.getItem("api_search") : process.env.REACT_APP_SV_CRAWL_URL);
        const apiMixDomain = (isDevMode && AdminStorage.getItem("api_mix") ? AdminStorage.getItem("api_mix") : process.env.REACT_APP_SV_MIX_URL);
        return (
            <div className="col-result-full">
                <div className="box-card box-full">
                    <div className="card-body" style={{minHeight: "300px"}}>
                        <CanRender actionCode={ROLES.home_page_view_popup_survey_link}>
                            <ModalSurveyLink />
                        </CanRender>
                        {isDevMode && isDebug && (
                            <div className="row">
                                <div className="col-md-4 col-md-offset-4">
                                    <h3 className="text-center mb10">Danh sách cấu hình Domain API.</h3>
                                    <form className="form-horizontal">
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Employer:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_employer"
                                                       onChange={this._onChange} defaultValue={apiEmployerDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api System:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_system"
                                                       onChange={this._onChange} defaultValue={apiSystemDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Auth:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_auth"
                                                       onChange={this._onChange} defaultValue={apiAuthDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Booking:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_booking"
                                                       onChange={this._onChange} defaultValue={apiBookingDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api SalesOrder:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_sales_order"
                                                       onChange={this._onChange} defaultValue={apiSalesOrderDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Plan:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_plan"
                                                       onChange={this._onChange} defaultValue={apiPlanDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Plan:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_statistic"
                                                       onChange={this._onChange} defaultValue={apiStatisticDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Call:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_call"
                                                       onChange={this._onChange} defaultValue={apiCallDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api CDN:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_domain"
                                                       onChange={this._onChange} defaultValue={apiCdnDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Seeker:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_seeker"
                                                       onChange={this._onChange} defaultValue={apiSeekerDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Seeker:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_seeker"
                                                       onChange={this._onChange} defaultValue={apiResumeDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Print:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_print"
                                                       onChange={this._onChange} defaultValue={apiPrintDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Article:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_article"
                                                       onChange={this._onChange} defaultValue={apiArticleDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Search:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_search"
                                                       onChange={this._onChange} defaultValue={apiSearchDomain}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">Api Mix:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" name="api_mix"
                                                       onChange={this._onChange} defaultValue={apiMixDomain}/>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        <div className="row">
                            <div className="col-sm-12">
                                <Link
                                    to={Constant.BASE_URL_JOB}>
                                    <span>Link Job Post</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default index;

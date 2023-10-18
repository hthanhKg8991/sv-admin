import {fnGetV2, fnGetV3, fnPostV2} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnPostForm} from "api/index";

export const getSeeker = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_SEEKER_LIST, params);
};

export const seekerDetail = async (id) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER, {id : id});
};

export const seekerDetailv2 = async (params) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER, params);
};
export const seekerDetailHideContact = async (params) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_HIDE_CONTACT_SEEKER, params);
};
export const seekerRevisionDetailHideContact = async (seeker_id) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_HIDE_CONTACT_SEEKER_REVISION, { seeker_id: seeker_id });
};

export const seekerRevision = async (seeker_id) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER_REVISION, {seeker_id : seeker_id});
};

export const seekerListRevision = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_SEEKER_REVISION_LIST, params);
};

export const seekerDetailRevision = async (id) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_SEEKER_REVISION_DETAIL, {id: id});
};

export const addSeeker = async (params = {}) => {
    return await fnPostForm(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_CREATE, params);
};

export const updateSeeker = async (params = {}) => {
    return await fnPostForm(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_UPDATE, params);
};

export const getResume = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_LIST, params);
};

export const verifyEmailSeeker = async (params = {}) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_VERIFIED_EMAIL, params);
};

export const verifySmsSeeker = async (params = {}) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_VERIFIED_SMS, params);
};

export const saveSeekerSupport = async (params = {}) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_SUPPORT_EDIT, params);
};

export const approveSeeker = async (seeker_id) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_APPROVE, {id: seeker_id});
};

export const rejectSeeker = async (params) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_REJECT, params);
};

export const approveSeekerRevision = async (seeker_id) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_REVISION_APPROVE, {id: seeker_id});
};

export const rejectSeekerRevision = async (params) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_REVISION_REJECT, params);
};

export const deleteSeeker = async (seeker_id) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_DELETE, {id : seeker_id});
};

export const changePassword = async (params) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_CHANGE_PASSWORD, params);
};

export const seekerChangeAssigner = async (params= {}) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_CHANGE_ASSIGNER, params);
};

export const getResumeTemplate = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_TEMPLATE, params);
};

export const resumeTemplateDetail = async (id) => {
    return await fnGetV2(config.apiSeekerDomain, `${ConstantURL.API_URL_GET_RESUME_TEMPLATE}/${id}`, {});
};

export const createResumeTemplate = async (params = {}) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_TEMPLATE_CREATE, params);
};

export const updateResumeTemplate = async (params = {}) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_TEMPLATE_UPDATE, params);
};

export const toggleStatusResumeTemplate = async (id) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_TEMPLATE_TOGGLE_STATUS, {id});
};

export const deleteResumeTemplate = async (id) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_TEMPLATE_DELETE, {id});
};

export const getResumeDaily = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_DAILY_RESUME, params);
};

export const getJobDailyDetail = async (params = {}) => {
    return await fnGetV3(config.apiEmployerDomain, ConstantURL.API_URL_GET_DAILY_JOB_DETAIL, params);
};

export const saveLogsDailyViewed = async (params = {}) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_DAILY_RESUME, params);
};

export const updateResumeViewedDaily = async (params = {}) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_UPDATE_VIEWED_DAILY_RESUME, params);
};

export const getListVerifyLog = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_VERIFY_LOG_LIST, params);
};

export const getListUniversity = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_UNIVERSITY_LIST, params);
};
export const getListUniversityCareer = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_UNIVERSITY_CAREER_LIST, params);
};

export const seekerDetailExperiment = async (id) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_SEEKER_EXPERIMENT_DETAIL, {seeker_id: id});
};

export const seekerCvList = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_LIST_SEEKER_CV, params);
};

export const seekerCvDetail = async (seeker_id) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER_CV, {seeker_id : seeker_id});
};
export const seekerCvDetailChannel = async (seeker_id,channel) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER_CV, {seeker_id : seeker_id, old_channel_code: channel});
};
export const getResumeAccountServiceList = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_ACCOUNT_SERVICE_LIST, params);
};
export const AddResumeCvScanner = async (params = {}) => {
    return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_CV_SCANNER_SAVE, params);
};
export const ResumeCvScannerDetection = async (params = {}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_CV_SCANNER_DETECTION, params);
};
export const getResumeCvScannerList = async (params={}) => {
    return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_CV_SCANNER_LIST, params);
};


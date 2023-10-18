import {fnGetV2, fnPostV2, fnPostForm} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";

export const getList = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB, params);
};

export const add = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_JOB_CREATE, params);
};

export const update = async (params = {}) => {
    return await fnPostForm(config.apiEmployerDomain, ConstantURL.API_URL_POST_JOB_EDIT, params);
};

export const getDetail = async (id) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_JOB, {id: id});
};

export const getRevision = async (job_id) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_JOB_REVISION, {job_id: job_id});
};

export const getListRevision = async (params = {}) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB_REVISION, params);
};

export const getDetailRevision = async (id) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB_REVISION_DETAIL, {id: id});
};

export const approve = async (job_id) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_JOB_APPROVE, {id: job_id});
};

export const reject = async (params) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_JOB_REJECT, params);
};

export const approveRevision = async (job_id) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_JOB_REVISION_APPROVE, {id: job_id});
};

export const rejectRevision = async (params) => {
    return await fnPostV2(config.apiEmployerDomain, ConstantURL.API_URL_POST_JOB_REVISION_REJECT, params);
}

export const getJobRefresh = async (params) => {
    return await fnGetV2(config.apiEmployerDomain, ConstantURL.API_URL_GET_JOB_REFRESH_LIST, params);
}

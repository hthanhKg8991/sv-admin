import { fnGetV2, fnPostV2 } from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";

export const getResume = async (params = {}) => {
  return await fnGetV2(config.apiResumeDomain, ConstantURL.API_URL_GET_RESUME_LIST, params);
};

export const getResumeDetail = async (id) => {
  const params = {
    id,
    list: true,
  };
  return await fnGetV2(config.apiResumeDomain, ConstantURL.API_URL_GET_RESUME_DETAIL, params);
};

export const getResumeDetailV2 = async (params) => {
  return await fnGetV2(config.apiResumeDomain, ConstantURL.API_URL_GET_RESUME_DETAIL, params);
};

export const resumeListRevision = async (params = {}) => {
  return await fnGetV2(config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_REVISION_LIST, params);
};

export const getResumeRevision = async (id) => {
  const params = {
    resume_id: id,
    list: true,
  };
  return await fnGetV2(config.apiResumeDomain, ConstantURL.API_URL_GET_RESUME_DETAIL_REVISION, params);
};

export const approveResume = async (seeker_id) => {
  return await fnPostV2(config.apiResumeDomain, ConstantURL.API_URL_POST_RESUME_APPROVE, { id: seeker_id });
};

export const rejectResume = async (params) => {
  return await fnPostV2(config.apiResumeDomain, ConstantURL.API_URL_POST_RESUME_REJECT, params);
};

export const deleteResume = async (id) => {
  return await fnPostV2(config.apiResumeDomain, ConstantURL.API_URL_POST_RESUME_DELETE, { id });
};

export const createResumeStep = async (params) => {
  return await fnPostV2(config.apiResumeDomain, ConstantURL.API_URL_POST_RESUME_STEP_CREATE, params);
};

export const updateResumeStep = async (params) => {
  return await fnPostV2(config.apiResumeDomain, ConstantURL.API_URL_POST_RESUME_STEP_UPDATE, params);
};

export const createResumeFile = async (params) => {
  return await fnPostV2(config.apiResumeDomain, ConstantURL.API_URL_POST_RESUME_FILE_CREATE, params);
};

export const updateResumeFile = async (params) => {
  return await fnPostV2(config.apiResumeDomain, ConstantURL.API_URL_POST_RESUME_FILE_UPDATE, params);
};

export const getResumeMeta = async (params) => {
  return await fnGetV2(config.apiResumeDomain, ConstantURL.API_URL_GET_RESUME_META, params);
};

export const deleteResumeMeta = async (params) => {
  return await fnPostV2(config.apiResumeDomain, ConstantURL.API_URL_POST_RESUME_META_DELETE, params);
};

export const getResumeHeadhunt = async (params = {}) => {
  const ignoreChannel = true;
  return await fnGetV2(config.apiResumeDomain, ConstantURL.API_URL_GET_RESUME_LIST, params, 0, ignoreChannel);
};


export const extractingPlainText = async (params) => {
  return await fnPostV2(config.apiSeekerDomain, ConstantURL.API_URL_EXTRACTING_PLAIN_TEXT, params);
};

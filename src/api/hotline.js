import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import { fnGetV2, fnPostForm, fnPostV2 } from "api/index";

const domainUrl = config.apiEmployerDomain;

export const getListContactHotline = async (params = {}) => {
  return await fnGetV2(
    domainUrl,
    ConstantURL.API_URL_GET_LIST_EMPLOYER_HOTLINE,
    params
  );
};

export const contactHotlineDetail = async (id) => {
  return await fnGetV2(
    domainUrl,
    ConstantURL.API_URL_GET_DETAIL_EMPLOYER_HOTLINE,
    { id: id }
  );
};

export const addContactHotline = async (params = {}) => {
  return await fnPostForm(
    domainUrl,
    ConstantURL.API_URL_CREATE_EMPLOYER_HOTLINE,
    params
  );
};

export const updateContactHotline = async (params = {}) => {
  return await fnPostForm(
    domainUrl,
    ConstantURL.API_URL_EDIT_EMPLOYER_HOTLINE,
    params
  );
};

export const getListHistoryHotline = async (params = {}) => {
  return await fnGetV2(
    domainUrl,
    ConstantURL.API_URL_GET_LIST_HISTORY_HOTLINE,
    params
  );
};

export const getHistoryHotlineDetail = async (params = {}) => {
  return await fnGetV2(
    domainUrl,
    ConstantURL.API_URL_GET_HISTORY_DETAIL_HOTLINE,
    params
  );
};

export const updateStatusHistoryHotline = async (params = {}) => {
  return await fnPostForm(
    domainUrl,
    ConstantURL.API_URL_UPDATE_STATUS_HISTORY,
    params
  );
};

export const exportListContactHotline = async (params = {}) => {
  return await fnGetV2(
    domainUrl,
    ConstantURL.API_URL_EXPORT_LIST_CONTACT_HOTLINE,
    params
  );
};

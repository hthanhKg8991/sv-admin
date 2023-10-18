import {fnGetV2, fnPostForm, fnPostV2} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";

export const getListStatement = async (params = {}) => {
    return await fnGetV2(config.apiStatementDomain, ConstantURL.API_URL_GET_STATEMENT_LIST, params);
};

export const createStatement = async (params = {}) => {
    return await fnPostForm(config.apiStatementDomain, ConstantURL.API_URL_POST_STATEMENT_CREATE, params);
};

export const importStatement = async (params = {}) => {
    return await fnPostV2(config.apiStatementDomain, ConstantURL.API_URL_POST_STATEMENT_IMPORT, params);
};

export const exportStatement = async (params = {}) => {
    return await fnGetV2(config.apiStatementDomain, ConstantURL.API_URL_GET_STATEMENT_EXPORT, params);
};

export const updateStatement = async (params = {}) => {
    return await fnPostV2(config.apiStatementDomain, ConstantURL.API_URL_POST_STATEMENT_UPDATE, params);
};

export const getListBank = async (params = {}) => {
    return await fnGetV2(config.apiStatementDomain, ConstantURL.API_URL_GET_BANK_LIST, params);
};

export const updateStatusPrint = async (params = {}) => {
    return await fnPostV2(config.apiStatementDomain, ConstantURL.API_URL_POST_UPDATE_STATUS_PRINT, params);
};

export const getListBankItems = async (params = {}) => {
    const res = await fnGetV2(config.apiStatementDomain, ConstantURL.API_URL_GET_BANK_LIST, params);
    return res?.items || [];
};

export const getListBankStaff = async (params = {}) => {
    return await fnGetV2(config.apiStatementDomain, ConstantURL.API_URL_GET_BANK_STAFF_LIST, params);
};

export const createBankStaff = async (params = {}) => {
    return await fnPostV2(config.apiStatementDomain, ConstantURL.API_URL_POST_BANK_STAFF_CREATE, params);
};

export const deleteBankStaff = async (params = {}) => {
    return await fnPostV2(config.apiStatementDomain, ConstantURL.API_URL_POST_BANK_STAFF_DELETE, params);
};

export const getEmailAccountantLiabilities = async (params = {}) => {
    return await fnGetV2(config.apiStatementDomain, ConstantURL.API_URL_GET_LIST_ACCOUNTANT_LIABILITIES, params);
};

export const deleteStatement = async (params = {}) => {
    return await fnPostV2(config.apiStatementDomain, ConstantURL.API_URL_DELETE_STATEMENT, params);
};
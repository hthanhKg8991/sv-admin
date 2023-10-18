import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fnGetV2, fnPostV2, fnPostForm, fnGetV3} from "api/index";

export const getListSurveyJsQuestion = async (params = {}) => {
    return await fnGetV2(config.apiSurveyDomain, ConstantURL.API_URL_GET_SURVEYJS_QUESTION_LIST, params);
};

export const getDetailSurveyJsQuestion = async (params = {}) => {
    return await fnGetV2(config.apiSurveyDomain, ConstantURL.API_URL_GET_SURVEYJS_QUESTION_DETAIL, params);
};

export const createSurveyJsQuestion = async (params = {}) => {
    return await fnPostForm(config.apiSurveyDomain, ConstantURL.API_URL_POST_SURVEYJS_QUESTION_CREATE, params);
};

export const updateSurveyJsQuestion = async (params = {}) => {
    return await fnPostForm(config.apiSurveyDomain, ConstantURL.API_URL_POST_SURVEYJS_QUESTION_UPDATE, params);
};

export const deleteSurveyJsQuestion = async (params = {}) => {
    return await fnPostV2(config.apiSurveyDomain, ConstantURL.API_URL_POST_SURVEYJS_QUESTION_DELETE, params);
};

export const toggleSurveyJsQuestion = async (params = {}) => {
    return await fnPostV2(config.apiSurveyDomain, ConstantURL.API_URL_POST_SURVEYJS_QUESTION_TOGGLE, params);
};

export const getListSurveyJsAnswer = async (params = {}) => {
    return await fnGetV2(config.apiSurveyDomain, ConstantURL.API_URL_GET_SURVEYJS_ANSWER_LIST, params);
};

export const getDetailSurveyJsAnswer = async (params = {}) => {
    return await fnGetV2(config.apiSurveyDomain, ConstantURL.API_URL_GET_SURVEYJS_ANSWER_DETAIL, params);
};

export const getDetailSurveyJsAnswerFull = async (params = {}) => {
    return await fnGetV3(config.apiSurveyDomain, ConstantURL.API_URL_GET_SURVEYJS_ANSWER_DETAIL, params);
};

export const getResultSurveyJsAnswer = async (params = {}) => {
    return await fnGetV2(config.apiSurveyDomain, ConstantURL.API_URL_GET_SURVEYJS_ANSWER_RESULT, params);
};

export const createSurveyJsAnswer = async (params = {}) => {
    return await fnPostV2(config.apiSurveyDomain, ConstantURL.API_URL_POST_SURVEYJS_ANSWER_CREATE, params);
};
// Group survey
export const getListGroupSurvey = async (params = {}) => {
    return await fnGetV2(config.apiSurveyDomain, ConstantURL.API_URL_GET_GROUP_SURVEY_LIST, params);
};

export const getDetailGroupSurvey = async (params = {}) => {
    return await fnGetV2(config.apiSurveyDomain, ConstantURL.API_URL_GET_GROUP_SURVEY_DETAIL, params);
};

export const createGroupSurvey = async (params = {}) => {
    return await fnPostV2(config.apiSurveyDomain, ConstantURL.API_URL_POST_GROUP_SURVEY_CREATE, params);
};

export const updateGroupSurvey = async (params = {}) => {
    return await fnPostV2(config.apiSurveyDomain, ConstantURL.API_URL_POST_GROUP_SURVEY_UPDATE, params);
};

export const toggleActiveGroupSurvey = async (params = {}) => {
    return await fnPostV2(config.apiSurveyDomain, ConstantURL.API_URL_POST_GROUP_SURVEY_TOGGLE_ACTIVE, params);
};

export const deleteGroupSurvey = async (params = {}) => {
    return await fnPostV2(config.apiSurveyDomain, ConstantURL.API_URL_POST_GROUP_SURVEY_DELETE, params);
};

export const addDivisionGroupSurvey = async (params = {}) => {
    return await fnPostV2(config.apiSurveyDomain, ConstantURL.API_URL_POST_GROUP_SURVEY_ADD_DIVISION, params);
};

export const deleteDivisionGroupSurvey = async (params = {}) => {
    return await fnPostV2(config.apiSurveyDomain, ConstantURL.API_URL_POST_GROUP_SURVEY_DELETE_DIVISION, params);
};

export const getListDivisionGroupSurvey = async (params = {}) => {
    return await fnGetV2(config.apiSurveyDomain, ConstantURL.API_URL_GET_GROUP_SURVEY_LIST_DIVISION, params);
};

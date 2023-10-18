import { fnGetV2, fnGetV3, fnPostV2 } from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import { fnPostV3 } from "api/index";

export const getCustomerList = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_AUTH_STAFF_LIST,
    params
  );
};

export const postLoginSocial = async (params = {}) => {
  return await fnPostV2(
      config.apiAuthDomain,
      ConstantURL.API_URL_POST_LOGIN_SOCIAL,
      params
  );
};

export const getListStaff = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_AUTH_STAFF_LIST,
    params
  );
};

export const getListStaffItems = async (params = {}) => {
  const res = await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_AUTH_STAFF_LIST,
    params
  );
  return res?.items || [];
};

export const getMembers = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_TEAM_MEMBER_LIST,
    params
  );
};

export const getCustomerListNew = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_CUSTOMER_LIST,
    params
  );
};

export const getCustomerListNewIgnoreChannelCode = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_CUSTOMER_LIST,
    params,
    0,
    true,
    true
  );
};

export const getPermission = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_PERMISSION,
    params
  );
};

export const getMenuWithAction = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_MENU_WITH_ACTION,
    params
  );
};

export const savePermission = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_PERMISSION_SAVE,
    params
  );
};

export const getAction = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_ACTION_LIST,
    params
  );
};

export const toggleStatusAction = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_ACTION_TOGGLE_STATUS,
    params
  );
};

export const createAction = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_ACTION_CREATE,
    params
  );
};

export const updateAction = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_ACTION_UPDATE,
    params
  );
};

export const deleteAction = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_ACTION_DELETE,
    params
  );
};

export const savePermissionAction = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_PERMISSION_ACTION_SAVE,
    params
  );
};

export const deletePermissionAction = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_PERMISSION_ACTION_DELETE,
    params
  );
};

export const toggleStatusPermission = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_PERMISSION_TOGGLE_STATUS,
    params
  );
};

export const deletePermission = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_PERMISSION_DELETE,
    params
  );
};

export const getListRoom = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_ROOM_LIST,
    params
  );
};

export const getListRoomItems = async (params = {}) => {
  const res = await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_ROOM_LIST,
    params
  );
  return res?.items || [];
};

export const getRoomDetail = async (params = {}) => {
  return await fnGetV3(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_ROOM_DETAIL,
    params
  );
};

export const getListDivision = async (params = {}) => {
  const res = await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_DIVISION_LIST,
    params
  );
  return {
    before: 1,
    current: 1,
    items: res,
    last: 999,
    next: 1,
    total_items: 999,
    total_pages: 1,
  };
};

export const getListDivisionItems = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_DIVISION_LIST,
    params
  );
};

export const getTeamMember = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_TEAM_MEMBER_LIST,
    params
  );
};

export const getStaffHeadhunt = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_STAFF_HEADHUNT,
    params
  );
};

export const getTeamList = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_TEAM_LIST,
    params
  );
};

export const getListStaffFree = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_AUTH_LIST_STAFF_FREE,
    params
  );
};

export const getMenuPermissionCode = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_MENU_PERMISSION_CODE,
    params
  );
};

export const checkOTP = async (params = {}) => {
  return await fnPostV3(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_LOGIN_OTP,
    params
  );
};

export const sendOTP = async (params = {}) => {
  return await fnPostV3(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_SEND_OTP,
    params
  );
};

export const getDetailStaff = async (id) => {
  return await fnGetV2(
    config.apiAuthDomain,
    `${ConstantURL.API_URL_GET_AUTH_STAFF_DETAIL}/${id}`
  );
};

export const getAuthTeamListItems = async (params = {}) => {
  const res = await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_AUTH_TEAM_LIST
  );
  return res?.items || [];
};

export const getStaffDetail = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    `${ConstantURL.API_URL_GET_STAFF_DETAIL}/${params.id}`,
    params
  );
};

export const resetPassword = async (params = {}) => {
  return await fnPostV3(
    config.apiAuthDomain,
    ConstantURL.API_URL_POST_RESET_PASS,
    params
  );
};

export const getListQAMHotline = async (params = {}) => {
  return await fnGetV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_GET_LIST_QAM_HOTLINE,
    params
  );
};

export const updateAllowReceiveEmployer = async (params = {}) => {
  return await fnPostV2(
    config.apiAuthDomain,
    ConstantURL.API_URL_UPDATE_ALLOW_RECEIVE_EMPLOYER,
    params
  );
}

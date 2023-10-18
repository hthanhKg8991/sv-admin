import {
  fnGetV2,
  fnGetV3,
  fnPostV2,
  fnPutV1,
  fnDeleteV1,
  fnPatchV1,
} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import {fakePaginate, fnPostForm, fnPostV3} from "api/index";

export const getHistoryActived = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_ACTIVED_SERVICE,
    params
  );
};

export const getPointActive = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_POINT_ACTIVE,
    params
  );
};

export const getHistoryBought = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_HISTORY,
    params
  );
};

export const getHistoryBoughtDetail = async (params = {}) => {
  return await fnGetV2(
      config.apiSalesOrderDomain,
      ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_BUY_SERVICE,
      {...params, per_page: 200}
  );
};

export const getRunningBannerList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_RUNNING_BANNER_LIST,
    params
  );
};

export const getRunningBannerDetail = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_RUNNING_BANNER_DETAIL,
    params
  );
};

export const createRunningBanner = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_RUNNING_BANNER_CREATE,
    params
  );
};

export const updateRunningBanner = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_RUNNING_BANNER_UPDATE,
    params
  );
};

export const deleteRunningBanner = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_RUNNING_BANNER_DELETE,
    params
  );
};

export const getPointGuaranteeList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POINT_GUARANTEE_LIST,
    params
  );
};

export const getPointGuaranteeReport = async (params = {}) => {
    const args = {...params};
  delete params.common;
  const res = await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POINT_GUARANTEE_BOX_REPORT,
    params
  );
  const items = args.common.map((_) =>
    res[Number(_.value)]
      ? {
          reason: Number(_.value),
          total: res[Number(_.value)],
        }
            : {reason: Number(_.value), total: null}
  );
  return fakePaginate(items);
};

export const deletePointGuarantee = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POINT_GUARANTEE_DELETE,
    params
  );
};
export const getListPremiumEmployer = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_EMPLOYER_PREMIUM,
    params
  );
};

export const getListPremiumJob = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_JOB_PREMIUM,
    params
  );
};

export const getListSalesOrderRegistration = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_LIST,
    params
  );
};

export const getListSalesOrderRegistrationAll = async (params = {}) => {
  const ignoreChannel = true;
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_LIST,
    params,
    0,
    ignoreChannel
  );
};

export const getDetailSalesOrder = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_DETAIL,
    params
  );
};

export const getListSalesOrderPrice = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_PRICE_LIST,
    params
  );
};

export const getListSalesOrderRequestDrop = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_REQUEST_DROP_LIST,
    params
  );
};

export const changeUrlBannerJob = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_CHANGE_URL_BANNER,
    params
  );
};

export const updateOrderDetail = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_EDIT,
    params
  );
};

export const getFilterJobList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_FILTER_JOB,
    params
  );
};

export const getFilterJobDetail = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_FILTER_JOB_DETAIL,
    params
  );
};

export const postFilterCreate = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_FILTER_JOB_CREATE,
    params
  );
};

export const postDeleteFilterJob = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_FILTER_JOB_DELETE,
    params
  );
};

export const getListPoint = async (params = {}) => {
  return await fnGetV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_POINT,
    params
  );
};

export const getListGuaranteeJob = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_GUARANTEE_JOB,
    params
  );
};

export const getDetailGuaranteeJob = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_GUARANTEE_JOB_DETAIL,
    params
  );
};

export const getListGuaranteeReport = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_GUARANTEE_REPORT,
    params
  );
};

export const getDetailGuaranteeReport = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_GUARANTEE_REPORT_DETAIL,
    params
  );
};

export const accountRegisCancelJobBox = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_CANCEL_JOB_BOX_APPROVE,
    params
  );
};

export const accountRegisCancelBanner = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_CANCEL_BANNER_APPROVE,
    params
  );
};

export const getListAccountantCampaign = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_CAMPAIGN_LIST,
    params
  );
};

export const getDetailAccountantCampaign = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_CAMPAIGN_DETAIL,
    params
  );
};

export const createAccountantCampaign = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_CAMPAIGN_CREATE,
    params
  );
};

export const updateAccountantCampaign = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_CAMPAIGN_UPDATE,
    params
  );
};

export const approveAccountantCampaign = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_CAMPAIGN_APPROVE,
    params
  );
};

export const rejectAccountantCampaign = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_CAMPAIGN_REJECT,
    params
  );
};

export const deleteAccountantCampaign = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_CAMPAIGN_DELETE,
    params
  );
};

export const getListEmployerResign = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EMPLOYER_RESIGN_LIST,
    params
  );
};

export const getDetailEmployerResign = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EMPLOYER_RESIGN_DETAIL,
    params
  );
};

export const createEmployerResign = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EMPLOYER_RESIGN_CREATE,
    params
  );
};

export const deleteEmployerResign = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EMPLOYER_RESIGN_DELETE,
    params
  );
};

export const getListAccountantCustomerFull = async (params = {}) => {
  return await fnGetV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST,
    params
  );
};

export const createSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_CREATE,
    params
  );
};

export const updateSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_EDIT,
    params
  );
};

export const deleteSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_DELETE,
    params
  );
};

export const previewSalesOrder = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW,
    params
  );
};

export const printSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_PRINT_CONTRACT,
    params
  );
};

export const printSalesOrderWord = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_PRINT_CONTRACT_WORD,
    params
  );
};

export const printSalesOrderOriginal = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_PRINT_CONTRACT_ORIGINAL,
    params
  );
};

export const printSalesOrderNew = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_PRINT_CONTRACT_NEW,
    params
  );
};

export const printPaymentRequest = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_PRINT_PAYMENT_REQUEST,
    params
  );
};

export const duplicateSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_DUPLICATE,
    params
  );
};

export const completeSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_COMPLETE,
    params
  );
};

export const sendRevenueReceive = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_SEND_REVENUE_RECEIVE,
    params
  );
};

export const requestApprove = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_REQUEST_APPROVE,
    params
  );
};

export const reserveRegistrationJobCreate = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_ITEMS_SUB_RESERVE,
    params
  );
};

export const reserveRegistrationJobOpen = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_ITEMS_SUB_OPEN_RESERVE,
    params
  );
};

export const getListPriceRunning = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PRICE_RUNNING,
    params
  );
};

export const getListSalesOrderSub = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_SUB_LIST,
    params
  );
};

export const getListSalesOrderJobOld = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_LIST_JOB_OLD,
    params
  );
};

export const getListSalesOrderEmployerOld = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_LIST_EMPLOYER_OLD,
    params
  );
};

export const updateExpiredSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_UPDATE_EXPIRED_SALES_ORDER,
    params
  );
};

export const getListRevenue = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_REVENUE_LIST,
    params
  );
};

export const exportListRevenue = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_REVENUE_EXPORT,
    params
  );
};

export const exportListTransaction = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_TRANSACTION_EXPORT,
    params
  );
};

export const getListPromotionPrograms = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PROMOTION_PROGRAMS_LIST,
    params
  );
};

export const getListPromotionProgramsNoPaginate = async (params = {}) => {
  const res = await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PROMOTION_PROGRAMS_LIST,
    params
  );
  return res?.items || [];
};

export const getDetailPromotionPrograms = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PROMOTION_PROGRAMS_DETAIL,
    params
  );
};

export const createPromotionPrograms = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PROMOTION_PROGRAMS_CREATE,
    params
  );
};

export const updatePromotionPrograms = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PROMOTION_PROGRAMS_UPDATE,
    params
  );
};

export const deletePromotionPrograms = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PROMOTION_PROGRAMS_DELETE,
    params
  );
};

export const getPromotionProgramsBySalesOrder = async (params = {}) => {
  const items = await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PROMOTION_PROGRAMS_BY_SALES_ORDER,
    params
  );
  return fakePaginate(items);
};

export const applySalesOrderPromotionPrograms = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PROMOTION_PROGRAMS_APPLY_SALES_ORDER,
    params
  );
};

export const getPromotionProgramAppliedsBySalesOrder = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PROMOTION_PROGRAMS_APPLIED_SALES_ORDER,
    params
  );
};

export const changePriceToRegisTration = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_CHANGE_PRICE_TO_REGISTRATION,
    params
  );
};

export const getDetailAccountCustomer = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL,
    params
  );
};

export const salesOrderRequestDropDetail = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_REQUEST_DROP_DETAIL,
    params
  );
};

export const salesOrderChangeJob = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_CHANGE_JOB,
    params
  );
};

export const getListJobBoxRunning = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_RUNNING_JOB_BOX_LIST,
    params
  );
};

export const getJobOrEffectRunning = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_SUB_GET_JOB_OR_EFFECT_RUNNING,
    params
  );
};

export const getListExtendPrograms = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EXTEND_PROGRAMS_LIST,
    params
  );
};

export const getDetailExtendPrograms = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EXTEND_PROGRAMS_DETAIL,
    params
  );
};

export const createExtendPrograms = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXTEND_PROGRAMS_CREATE,
    params
  );
};

export const updateExtendPrograms = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXTEND_PROGRAMS_UPDATE,
    params
  );
};

export const deleteExtendPrograms = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXTEND_PROGRAMS_DELETE,
    params
  );
};

export const approveExtendPrograms = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXTEND_PROGRAMS_APPROVE,
    params
  );
};

export const toggleActiveExtendPrograms = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXTEND_PROGRAMS_TOGGLE_ACTIVE,
    params
  );
};

export const checkExtendPrograms = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EXTEND_PROGRAMS_REGISTRATION,
    params
  );
};

export const addProductGroup = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ITEMS_GROUP_CREATE,
    params
  );
};

export const updateProductGroup = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ITEMS_GROUP_UPDATE,
    params
  );
};

export const deleteProductGroup = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ITEMS_GROUP_DELETE,
    params
  );
};

export const getProductGroupList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ITEMS_GROUP,
    params
  );
};

export const getDetailProductGroupList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ITEMS_GROUP_DETAIL,
    params
  );
};

export const salesOrderChangeBranchCode = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_CHANGE_BRANCH_CODE,
    params
  );
};

export const registrationEffectCheckJobBox = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REGISTRATION_EFFECT_CHECK_JOB_BOX,
    params
  );
};

export const getPointGiftList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_POINT_GIFT_LIST,
    params
  );
};
export const salesOrderReSyncOdoo = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_RE_SYNC_ODOO,
    params
  );
};

export const salesOrderCheckCancel = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_CHECK_CANCEL,
    params
  );
};

export const salesOrderCancel = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_PROCESS_CANCEL,
    params
  );
};

export const getListItemsGroup = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_ITEMS_GROUP_LIST,
    params
  );
};

export const getDetailItemsGroup = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_ITEMS_GROUP_DETAIL,
    params
  );
};

export const createItemsGroup = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_ITEMS_GROUP_CREATE,
    params
  );
};

export const updateItemsGroup = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_ITEMS_GROUP_UPDATE,
    params
  );
};

export const deleteItemsGroup = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_ITEMS_GROUP_DELETE,
    params
  );
};

export const importDataCash = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_IMPORT_DATA_CASH,
    params
  );
};

export const getListBundle = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_BUNDLES_LIST,
    params
  );
};

export const getDetailBundle = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_BUNDLES_DETAIL,
    params
  );
};

export const createBundle = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_BUNDLES_CREATE,
    params
  );
};

export const updateBundle = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_BUNDLES_UPDATE,
    params
  );
};

export const deleteBundle = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_BUNDLES_DELETE,
    params
  );
};

export const getListGroupBundle = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_BUNDLE_GROUP,
    params
  );
};

export const createGroupBundle = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_BUNDLE_GROUP_CREATE,
    params
  );
};

export const deleteGroupBundle = async (id) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_BUNDLE_GROUP_DELETE,
        {id}
  );
};

export const getListBundleItems = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_BUNDLES_ITEM_LIST,
    params
  );
};

export const createBundleItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_BUNDLES_ITEM_CREATE,
    params
  );
};

export const updateBundleItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_BUNDLES_ITEM_UPDATE,
    params
  );
};

export const deleteBundleItems = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_BUNDLES_ITEM_DELETE,
    params
  );
};

export const getListOpportunity = async (params = {}) => {
  return await fnGetV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_OPPORTUNITY_LIST,
    params
  );
};

export const updateOpportunity = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_UPDATE_OPPORTUNITY,
    params
  );
};

export const updateOpportunitySo = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_UPDATE_OPPORTUNITY_SO,
    params
  );
};

export const changeRevenueStaff = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_CHANGE_REVENUE_STAFF,
    params
  );
};

export const getListQuotationRequest = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_QUOTATION_REQUEST_LIST,
    params
  );
};

export const getDetailQuotationRequest = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_QUOTATION_REQUEST_DETAIL,
    params
  );
};

export const changeStatusQuotationRequest = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_QUOTATION_REQUEST_CHANGE_STATUS,
    params
  );
};

export const activatedTrial = async (params) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_ACTIVATED_TRIAL,
    params
  );
};

export const getListFieldQuotationRequest = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_QUOTATION_REQUEST_LIST,
    params
  );
};

export const getDetailFieldQuotationRequest = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_QUOTATION_REQUEST_DETAIL,
    params
  );
};

export const changeStatusFieldQuotationRequest = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_QUOTATION_REQUEST_CHANGE_STATUS,
    params
  );
};

export const getListPaymentRequest = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PAYMENT_REQUEST_INFO_LIST,
    params
  );
};

export const getDetailPaymentRequest = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PAYMENT_REQUEST_INFO_DETAIL,
    params
  );
};

export const createPaymentRequest = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PAYMENT_REQUEST_INFO_CREATE,
    params
  );
};

export const updatePaymentRequest = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PAYMENT_REQUEST_INFO_UPDATE,
    params
  );
};

export const deletePaymentRequest = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PAYMENT_REQUEST_INFO_DELETE,
    params
  );
};

export const getListPayment = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PAYMENT_LIST,
    params
  );
};

export const getLogsPayment = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PAYMENT_LOGS,
    params
  );
};

export const getListTransaction = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_TRANSACTION_LIST,
    params
  );
};

//Opportunity

export const getListOpportunityFull = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_OPPORTUNITY_LIST_FULL,
    params
  );
};

export const getListOpportunityCanUse = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_OPPORTUNITY_LIST_CAN_USE,
    params
  );
};

export const getOpportunityDetail = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_OPPORTUNITY_DETAIL,
    params
  );
};

export const createOpportunity = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_CREATE,
    params
  );
};

export const editOpportunity = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_EDIT,
    params
  );
};

export const changeLevelOpportunity = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_CHANGE_LEVEL,
    params
  );
};

export const exportOpportunity = async (params = {}) => {
  return await fnGetV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_EXPORT,
    params
  );
};

export const deleteOpportunity = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_DELETE,
    params
  );
};

export const keepOpportunity = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_KEEP,
    params
  );
};

export const cancelOpportunity = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_CANCEL,
    params
  );
};

export const restoreOpportunity = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_RESTORE,
    params
  );
};

export const getLogsOpportunity = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_LOGS,
    params
  );
};

export const getListOpportunityEmailTemplates = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_TEMPLATE_LIST,
    params
  );
};

export const getDetailOpportunityEmailTemplate = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_TEMPLATE_DETAIL,
    params
  );
};

export const createOpportunityEmailTemplate = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_TEMPLATE_CREATE,
    params
  );
};

export const updateOpportunityEmailTemplate = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_TEMPLATE_UPDATE,
    params
  );
};

export const deleteOpportunityEmailTemplate = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_TEMPLATE_DELETE,
    params
  );
};


export const toggleStatusOpportunityEmailTemplate = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_TEMPLATE_CHANGE_STATUS,
    params
  );
};

export const sendOpportunityReportPriceEmail = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_OPPORTUNITY_SEND_MAIL_QUOTE,
    params
  );
};

export const getLogsTransaction = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_TRANSACTION_LOGS,
    params
  );
};

export const updateStatusTransaction = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_TRANSACTION_UPDATE_STATUS,
    params
  );
};

export const salesConfirmStatusTransaction = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_TRANSACTION_SALES_CONFIRM_STATUS,
    params
  );
};

export const salesNotConfirmStatusTransaction = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_TRANSACTION_SALES_NOT_CONFIRM_STATUS,
    params
  );
};

export const salesCancelConfirm = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_TRANSACTION_SALES_CANCEL_CONFIRM,
    params
  );
};

export const accountantConfirmStatusTransaction = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_TRANSACTION_ACCOUNTANT_CONFIRM_STATUS,
    params
  );
};

export const accountantNotConfirmStatusTransaction = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_TRANSACTION_ACCOUNTANT_NOT_CONFIRM_STATUS,
    params
  );
};

export const accountantCancelConfirm = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_TRANSACTION_ACCOUNTANT_CANCEL_CONFIRM,
    params
  );
};

export const updateInternalTransaction = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_TRANSACTION_UPDATE_INTERNAL,
    params
  );
};

export const createExceptionalTransaction = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_TRANSACTION_CREATE_EXCEPTIONAL,
    params
  );
};

export const mappingManualStatement = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_STATEMENT_MAPPING_MANUAL,
    params
  );
};

export const getListSME = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SME_LIST,
    params
  );
};

export const exportListSME = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EXPORT_EXCEL_SME,
    params
  );
};

export const getListTypeLogs = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_TYPE_LOGS,
    params
  );
};

export const accountRegisJobBasicApprove = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_JOB_BASIC_APPROVE,
    params
  );
};

export const accountRegisFreemiumApprove = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REGIS_FREEMIUM_APPROVE,
    params
  );
};

export const accountRegisJobBoxApprove = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_JOB_BOX_APPROVE,
    params
  );
};

export const accountRegisBannerApprove = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_BANNER_APPROVE,
    params
  );
};

export const accountRegisMinisiteApprove = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_MINISITE_APPROVE,
    params
  );
};

export const accountRegisEffectApprove = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_EFFECT_APPROVE,
    params
  );
};

export const accountRegisFilterApprove = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_FILTER_RESUME_APPROVE,
    params
  );
};

export const accountRegisServicePointApprove = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_SERVICE_POINT_APPROVE,
    params
  );
};

export const regisEffectPackageCreate = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_CREATE,
    params
  );
};

export const getListSalesOrderByField = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_LIST,
    params
  );
};

export const getDetailSalesOrderByField = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_DETAIL,
    params
  );
};

export const createSalesOrderByField = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_CREATE,
    params
  );
};

export const updateSalesOrderByField = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_UPDATE,
    params
  );
};

export const deleteSalesOrderByField = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_DELETE,
    params
  );
};

export const submitSalesOrderByField = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SUBMIT,
    params
  );
};

export const approveSalesOrderByField = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_APPROVE,
    params
  );
};

export const cancelSalesOrderByField = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_CANCEL,
    params
  );
};

export const copySalesOrderByField = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_COPY,
    params
  );
};

export const getListSalesOrderByFieldItems = async (params = {}) => {
    const paramsAll = {...params, per_page: 1000};
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_ITEMS_LIST,
    paramsAll
  );
};

export const getListSalesOrderByFieldItemsItems = async (params = {}) => {
  const res = await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_ITEMS_LIST,
    params
  );
  return res?.items || [];
};

export const getDetailSalesOrderByFieldItems = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_ITEMS_DETAIL,
    params
  );
};

export const createSalesOrderByFieldItems = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_ITEMS_CREATE,
    params
  );
};

export const updateSalesOrderByFieldItems = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_ITEMS_UPDATE,
    params
  );
};

export const deleteSalesOrderByFieldItems = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_ITEMS_DELETE,
    params
  );
};

export const getListFieldRegistrationJobBoxPagination = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_REGISTRATION_JOB_BOX_LIST,
    params
  );
};

export const getListFieldRegistrationJobBox = async (params = {}) => {
    const paramsAll = {...params, per_page: 1000};
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_REGISTRATION_JOB_BOX_LIST,
    paramsAll
  );
};

export const getDetailFieldRegistrationJobBox = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_REGISTRATION_JOB_BOX_DETAIL,
    params
  );
};

export const createFieldRegistrationJobBox = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_REGISTRATION_JOB_BOX_CREATE,
    params
  );
};

export const deleteFieldRegistrationJobBox = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_REGISTRATION_JOB_BOX_DELETE,
    params
  );
};

export const approveFieldRegistrationJobBox = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_REGISTRATION_JOB_BOX_APPROVE,
    params
  );
};

export const cancelFieldRegistrationJobBox = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_REGISTRATION_JOB_BOX_CANCEL,
    params
  );
};

export const getListFieldPrintTemplate = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_PRINT_TEMPLATES_LIST,
    params
  );
};

export const getDetailFieldPrintTemplate = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_PRINT_TEMPLATES_DETAIL,
    params
  );
};

export const createFieldPrintTemplate = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PRINT_TEMPLATES_CREATE,
    params
  );
};

export const updateFieldPrintTemplate = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PRINT_TEMPLATES_UPDATE,
    params
  );
};

export const deleteFieldPrintTemplate = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PRINT_TEMPLATES_DELETE,
    params
  );
};

export const printFieldPrintTemplate = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PRINT_TEMPLATES_PRINT,
    params
  );
};

export const fieldSalesOrderPrintReport = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_PRINT_REPORT,
    params
  );
};

export const getListFieldPriceList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_PRICE_LIST_LIST,
    params
  );
};

export const getListFieldPriceListItems = async (params = {}) => {
  const res = await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_PRICE_LIST_LIST,
    params
  );
  return res?.items || [];
};

export const getDetailFieldPriceList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_PRICE_LIST_DETAIL,
    params
  );
};

export const createFieldPriceList = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PRICE_LIST_CREATE,
    params
  );
};

export const updateFieldPriceList = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PRICE_LIST_UPDATE,
    params
  );
};

export const deleteFieldPriceList = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PRICE_LIST_DELETE,
    params
  );
};

export const approveFieldPriceList = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PRICE_LIST_APPROVE,
    params
  );
};

export const getListFieldSalesOrderSchedulePagination = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_SCHEDULE_LIST,
    params
  );
};

export const getListFieldSalesOrderSchedule = async (params = {}) => {
    const paramsAll = {...params, per_page: 1000};
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_SCHEDULE_LIST,
    paramsAll
  );
};

export const getDetailFieldSalesOrderSchedule = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_SCHEDULE_DETAIL,
    params
  );
};

export const createFieldSalesOrderSchedule = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_CREATE,
    params
  );
};

export const updateFieldSalesOrderSchedule = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_UPDATE,
    params
  );
};

export const deleteFieldSalesOrderSchedule = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_DELETE,
    params
  );
};

export const submitFieldSalesOrderSchedule = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_SUBMIT,
    params
  );
};

export const approveFieldSalesOrderSchedule = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_APPROVE,
    params
  );
};

export const rejectFieldSalesOrderSchedule = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_REJECT,
    params
  );
};

export const confirmPaymentFieldSalesOrderSchedule = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_CONFIRM_PAYMENT,
    params
  );
};

export const getListFieldSalesOrderScheduleUser = async (params = {}) => {
    const paramsAll = {...params, per_page: 1000};
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_SCHEDULE_USER_LIST,
    paramsAll
  );
};

export const getDetailFieldSalesOrderScheduleUser = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_SALES_ORDER_SCHEDULE_USER_DETAIL,
    params
  );
};

export const createFieldSalesOrderScheduleUser = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_USER_CREATE,
    params
  );
};

export const updateFieldSalesOrderScheduleUser = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_USER_UPDATE,
    params
  );
};

export const deleteFieldSalesOrderScheduleUser = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_SALES_ORDER_SCHEDULE_USER_DELETE,
    params
  );
};

export const requestConfirmPayment = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REQUEST_CONFIRM_PAYMENT,
    params
  );
};

export const getListAccountantCustomer = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST,
    params
  );
};

export const getDetailAccountantCustomer = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL,
    params
  );
};

export const saveAccountantCustomer = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_CUSTOMER_SAVE,
    params
  );
};

export const approveCustomerAccountant = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_CUSTOMER_APPROVE,
    params
  );
};

export const rejectCustomerAccountant = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_CUSTOMER_REJECT,
    params
  );
};

export const deleteCustomerAccountant = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_CUSTOMER_DELETE,
    params
  );
};

export const getListFieldPromotionPrograms = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_PROMOTION_PROGRAMS_LIST,
    params
  );
};

export const getListFieldPromotionProgramsItems = async (params = {}) => {
  const res = await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_PROMOTION_PROGRAMS_LIST,
    params
  );
  return res.items || [];
};

export const getDetailFieldPromotionPrograms = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_FIELD_PROMOTION_PROGRAMS_DETAIL,
    params
  );
};

export const createFieldPromotionPrograms = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PROMOTION_PROGRAMS_CREATE,
    params
  );
};

export const updateFieldPromotionPrograms = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PROMOTION_PROGRAMS_UPDATE,
    params
  );
};

export const deleteFieldPromotionPrograms = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PROMOTION_PROGRAMS_DELETE,
    params
  );
};

export const toggleFieldPromotionPrograms = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_FIELD_PROMOTION_PROGRAMS_TOGGLE,
    params
  );
};

export const updateInfoSub = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_UPDATE_INFO_SUB,
    params
  );
};

export const getCommonGuaranteeInfo = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_COMMON_GUARANTEE_INFO,
    params
  );
};

export const updateCommonGuaranteeInfo = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_UPDATE_GUARANTEE_INFO,
    params
  );
};

export const getDetailGuaranteeInfo = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_DETAIL_GUARANTEE_INFO,
    params
  );
};

export const updateDetailGuaranteeInfo = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_UPDATE_DETAIL_GUARANTEE_INFO,
    params
  );
};

export const exportFieldRegistrationJobBox = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EXPORT_FIELD_REGISTRATION_JOB_BOX,
    params
  );
};

export const getExchangeSalesOrder = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EXCHANGE_SALES_ORDER_GET_SALES_ORDER,
    params
  );
};

export const getListExchangeSalesOrder = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EXCHANGE_SALES_ORDER_LIST,
    params
  );
};

export const getDetailExchangeSalesOrder = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EXCHANGE_SALES_ORDER_DETAIL,
    params
  );
};

export const createExchangeSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXCHANGE_SALES_ORDER_CREATE,
    params
  );
};

export const submitExchangeSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXCHANGE_SALES_ORDER_SUBMIT,
    params
  );
};

export const cancelExchangeSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXCHANGE_SALES_ORDER_CANCEL,
    params
  );
};

export const approveExchangeSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXCHANGE_SALES_ORDER_APPROVE,
    params
  );
};

export const rejectExchangeSalesOrder = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_EXCHANGE_SALES_ORDER_REJECT,
    params
  );
};

export const salesOrderUpdateCreditApply = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_POST_SALES_ORDER_UPDATE_CREDIT_APPLY,
    params
  );
};

export const getTotalAmountCreditEmployer = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_CREDIT_EMPLOYER_TOTAL_AMOUNT,
    params
  );
};

export const getListCreditEmployer = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_CREDIT_EMPLOYER_LIST,
    params
  );
};

export const getListCreditEmployerDetail = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_CREDIT_EMPLOYER_DETAIL_LIST,
    params
  );
};

export const duplicateSalesOrderExchange = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_POST_SALES_ORDER_DUPLICATE_EXCHANGE,
    params
  );
};

export const getInfoContractList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_INFO_CONTRACT_LIST,
    params
  );
};

export const getListPackageGiftConfig = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_LIST_GIFT_PACKAGE_CONFIG,
    params
  );
};

export const getDetailPackageGiftConfig = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_DETAIL_GIFT_PACKAGE_CONFIG,
    params
  );
};

export const createPackageGiftConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_CREATE_GIFT_PACKAGE_CONFIG,
    params
  );
};

export const updatePackageGiftConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_UPDATE_GIFT_PACKAGE_CONFIG,
    params
  );
};

export const deletePackageGiftConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_DELETE_GIFT_PACKAGE_CONFIG,
    params
  );
};

export const approvePackageGiftConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_APPROVE_GIFT_PACKAGE_CONFIG,
    params
  );
};

export const pausePackageGiftConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_PAUSED_GIFT_PACKAGE_CONFIG,
    params
  );
};

export const resendEmail = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SALES_ORDER_RESEND_EMAIL,
    params
  );
};

export const activeJobFreemium = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_ACTIVE_JOB_FREEMIUM,
    params
  );
};

export const getListHistoryRunningService = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_GET_SALES_ORDER_HISTORY_RUNNING_SERVICE,
    params
  );
};
export const getListHistoryStatisticSalesOrder = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_STATISTIC_SALES_ORDER_HISTORY,
    params
  );
};
export const getListHistoryStatisticSalesOrderItem = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_STATISTIC_SALES_ORDER_ITEM_HISTORY,
    params
  );
};

export const buyRecruiterAssistant = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_BUY_RECRUITER_ASSISTANT,
    params
  );
};

export const getSalesOrderItemList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_LIST,
    params
  );
};

export const regisRecruiterAssistant = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_REGIS_RECRUITER_ASSISTANT,
    params
  );
};

export const updateRegisRecruiterAssistant = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_UPDATE_REGIS_RECRUITER_ASSISTANT,
    params
  );
};

export const deleteSalesOrderItemList = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_DELETE_SALES_ORDER_ITEMS,
    params
  );
};

export const getSubAccountServiceList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_LIST_RECRUITER_ASSISTANT,
    params
  );
};

export const approveRegisRecruiterAssistant = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_APPROVE_REGIS_RECRUITER_ASSISTANT,
    params
  );
};

export const deleteRegisRecruiterAssistant = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_DELETE_REGIS_RECRUITER_ASSISTANT,
    params
  );
};

export const accountRegisCancelRecruiterAssistant = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNT_REGIS_CANCEL_RECRUITER_ASSISTANT_APPROVE,
    params
  );
};

export const getListCombo = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_COMBO_LIST,
    params
  );
};

export const getDetailCombo = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_COMBO_DETAIL,
    params
  );
};

export const getSuggestCombo = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_SUGGEST_COMBO,
    params
  );
};

export const createCombo = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_COMBO_CREATE,
    params
  );
};

export const updateCombo = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_COMBO_UPDATE,
    params
  );
};

export const deleteCombo = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_COMBO_DELETE,
    params
  );
};

export const toggleActiveCombo = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_COMBO_TOGGLE_ACTIVE,
    params
  );
};

export const getListComboItems = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_COMBO_ITEM_LIST,
    params
  );
};

export const createComboItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_COMBO_ITEM_CREATE,
    params
  );
};

export const updateComboItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_COMBO_ITEM_UPDATE,
    params
  );
};

export const deleteComboItems = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_COMBO_ITEM_DELETE,
    params
  );
};

export const getListGroupComboItem = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_COMBO_ITEM_GROUP_LIST,
    params
  );
};

export const createGroupComboItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_COMBO_ITEM_GROUP_CREATE,
    params
  );
};

export const deleteGroupComboItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_COMBO_ITEM_GROUP_DELETE,
    params
  );
};

export const getListSubscription = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_SUBSCRIPTION_LIST,
    params
  );
};

export const getDetailSubscription = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_SUBSCRIPTION_DETAIL,
    params
  );
};

export const createSubscription = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_SUBSCRIPTION_CREATE,
    params
  );
};

export const updateSubscription = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_SUBSCRIPTION_UPDATE,
    params
  );
};

export const deleteSubscription = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_SUBSCRIPTION_DELETE,
    params
  );
};

export const toggleActiveSubscription = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_SUBSCRIPTION_TOGGLE_ACTIVE,
    params
  );
};

export const getListSubscriptionItems = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_SUBSCRIPTION_ITEM_LIST,
    params
  );
};

export const createSubscriptionItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_SUBSCRIPTION_ITEM_CREATE,
    params
  );
};

export const updateSubscriptionItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_SUBSCRIPTION_ITEM_UPDATE,
    params
  );
};

export const deleteSubscriptionItems = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_ACCOUNTANT_SUBSCRIPTION_ITEM_DELETE,
    params
  );
};

export const getListGroupSubscriptionItem = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_SUBSCRIPTION_ITEM_GROUP_LIST,
    params
  );
};

export const createGroupSubscriptionItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_SUBSCRIPTION_ITEM_GROUP_CREATE,
    params
  );
};

export const deleteGroupSubscriptionItem = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_ACCOUNTANT_SUBSCRIPTION_ITEM_GROUP_DELETE,
    params
  );
};
export const getListNetsale = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LiST_NET_SALE,
    params
  );
};

export const getListOrderIncreasingConfig = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LiST_ADVANCE_OFFER,
    params
  );
};

export const getDetailOrderIncreasingConfig = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_DETAIL_ADVANCE_OFFER,
    params
  );
};

export const createOrderIncreasingConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_CREATE_ADVANCE_OFFER,
    params
  );
};

export const updateOrderIncreasingConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_UPDATE_ADVANCE_OFFER,
    params
  );
};

export const approveOrderIncreasingConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_APPROVE_ADVANCE_OFFER,
    params
  );
};

export const rejectOrderIncreasingConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REJECT_ADVANCE_OFFER,
    params
  );
};

export const copyOrderIncreasingConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_COPY_ADVANCE_OFFER,
    params
  );
};

export const deleteOrderIncreasingConfig = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_DELETE_ADVANCE_OFFER,
    params
  );
};

export const getListOrderIncreasingConfigPrice = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LiST_ADVANCE_OFFER_CONFIG_PRICE,
    params
  );
};

export const getListOrderIncreasingConfigPriceByComboId = async (
  params = {}
) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_ADVANCE_OFFER_CONFIG_PRICE_BY_COMBO_ID,
    params
  );
};

export const updateOrderIncreasingConfigPrice = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_UPDATE_ADVANCE_OFFER_CONFIG_PRICE,
    params
  );
};

export const createOrderIncreasingConfigPrice = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_CREATE_ADVANCE_OFFER_CONFIG_PRICE,
    params
  );
};

export const deleteOrderIncreasingConfigPrice = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_DELETE_ADVANCE_OFFER_CONFIG_PRICE,
    params
  );
};

export const getSalesOrderItem = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL,
    params
  );
};

export const buyFilterResume = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_BUY_FILTER_RESUME,
    params
  );
};

export const regisFilterResumer = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REGIS_FILTER_RESUME,
    params
  );
};

export const removeRegisFilterResumer = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REMOVE_REGIS_FILTER_RESUME,
    params
  );
};

export const approveRegisFilterResumer = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_APPROVE_REGIS_FILTER_RESUME,
    params
  );
};

export const dropRegisFilterResumer = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_DROP_REGIS_FILTER_RESUME,
    params
  );
};

export const approveDropRegisFilterResumer = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_APPROVE_DROP_REGIS_FILTER_RESUME,
    params
  );
};

export const getRevenueList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_REVENUE_COMPARE_LIST,
    params
  );
};

export const runCronRevenue = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_REVENUE_RUN_CRON,
    params
  );
};
export const exportExcelRevenue = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_EXPORT_EXCEL_REVENUE,
    params
  );
};
export const syncFileImportToOdoo = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_SEND_FILE_SYNC_TO_ODOO,
    params
  );
};
export const rerunLostRevenue = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_RUN_LOST_REVENUE,
    params
  );
};
export const getDetuctRevenueList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_DETUCT_REVENUE_LIST,
    params
  );
};
export const createDetuctRevenue = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_CREATE_DETUCT_REVENUE,
    params
  );
};
export const getListHistoryServiceVtn = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_HISTORY_SERVICE_VTN,
    params
  );
};

export const getListGroupCampaign = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LiST_GROUP_CAMPAIGN,
    params
  );
};

export const getDetailGroupCampaign = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_DETAIL_GROUP_CAMPAIGN,
    params
  );
};

export const createGroupCampaign = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_CREATE_GROUP_CAMPAIGN,
    params
  );
};

export const updateGroupCampaign = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_UPDATE_GROUP_CAMPAIGN,
    params
  );
};

export const approveGroupCampaign = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_CHANGE_STATUS_GROUP_CAMPAIGN,
        {...params, status: Constant.ACTIVE_STATUS_GROUP_CAMPAIGN_ITEM}
  );
};

export const rejectGroupCampaign = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_CHANGE_STATUS_GROUP_CAMPAIGN,
        {...params, status: Constant.INACTIVE_STATUS_GROUP_CAMPAIGN_ITEM}
  );
};

export const getListLogPromotionProgram = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PROMOTION_PROGRAM_EMPLOYER_LIST_LOG,
    params
  );
};

export const importPromotionProgram = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_IMPORT_PROMOTION_PROGRAM_EMPLOYER,
    params
  );
};

export const getListPromotionProgramEmployer = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_LIST_PROMOTION_PROGRAM_EMPLOYER,
    params
  );
};

export const sendMailPromotionProgramEmployer = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_SEND_MAIL_PROMOTION_PROGRAM_EMPLOYER,
    params
  );
};

export const createPromotionProgramEmployer = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_CREATE_PROMOTION_PROGRAM_EMPLOYER,
    params
  );
};

export const deletePromotionProgramEmployer = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_DELETE_PROMOTION_PROGRAM_EMPLOYER,
    params
  );
};

export const previewContractAddendum = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PREVIEW_CONTRACT_ADDENDUM,
    params
  );
};

export const previewReportDeal = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PREVIEW_REPORT_DEAL,
    params
  );
};

export const previewReportConfirm = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PREVIEW_REPORT_CONFIRM,
    params
  );
};

export const changeEffectRegisUpdateArea = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REGIS_EFFECT_UPDATE_AREA,
    params
  );
};

export const changeJobRegisUpdateArea = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REGIS_UPDATE_AREA,
    params
  );
};

export const priceListApprove = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PRICE_APPROVE,
    params
  );
};

export const priceListReject = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PRICE_REJECT,
    params
  );
};

export const priceListCopy = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PRICE_COPPY,
    params
  );
};

export const priceListDelete = async (params = {}) => {
  return await fnPostV3(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_PRICE_DELETE,
    params
  );
};

export const getPriceList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PRICE_LIST,
    params
  );
};

export const getPricePromotionList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PRICE_PROMOTION_LIST,
    params
  );
};

export const getPriceDetail = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_PRICE_DETAIL,
    params
  );
};

export const getDataAuditRevenueList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_DATA_AUDIT_REVENUE_LIST,
    params
  );
};

export const exportListDataAuditRevenue = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_DATA_AUDIT_REVENUE_EXPORT,
    params
  );
};

export const createPostingCombo = async (params = {}) => {
  return await fnPostForm(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING,
    params
  );
};

export const updatePostingCombo = async (params = {}) => {
  const url = `${ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING}/${params?.id}`;
  return await fnPutV1(config.apiSalesOrderDomain, url, params);
};

export const deletePostingCombo = async (params = {}) => {
  const url = `${ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING}/${params?.id}`;
  return await fnDeleteV1(config.apiSalesOrderDomain, url, params);
};

export const getListPostingCombo = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING,
    params
  );
};

export const getDetailPostingCombo = async (params = {}) => {
  const url = `${ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING}/${params?.id}`;
  return await fnGetV2(config.apiSalesOrderDomain, url, params);
};

export const toggleActivePostingCombo = async (params = {}) => {
  return await fnPatchV1(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING,
    params
  );
};

export const getListPostingComboItems = async (params = {}) => {
  const url = `${ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING}/${params?.combo_post_id}/item`;
  return await fnGetV2(config.apiSalesOrderDomain, url, params);
};

export const deletePostingComboItems = async (params = {}) => {
  const url = `${ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING}/${params?.combo_post_id}/item/${params?.id}`;
  return await fnDeleteV1(config.apiSalesOrderDomain, url, params);
};

export const createPostingComboItem = async (params = {}) => {
  const url = `${ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING}/${params?.combo_post_id}/item`;
  return await fnPostV2(config.apiSalesOrderDomain, url, params);
};

export const updatePostingComboItem = async (params = {}) => {
  const url = `${ConstantURL.API_URL_ACCOUNTANT_COMBO_POSTING}/${params?.combo_post_id}/item/${params?.id}`;
  return await fnPutV1(config.apiSalesOrderDomain, url, params);
};

export const getComboPost = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_COMBO_POST,
    params
  );
};

export const getDetailComboPost = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    `${ConstantURL.API_URL_GET_COMBO_POST_DETAIL}/${params?.id}`,
    params
  );
};

export const getComboPostItemList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_COMBO_POST_ITEM_LIST,
    params
  );
};

export const comboPostItemGroupCreate = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_COMBO_POST_CREATE,
    params
  );
};

export const comboPostItemGroupUpdate = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_COMBO_POST_UPDATE,
    params
  );
};

export const comboPostItemGroupDelete = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_COMBO_POST_DELETE,
    params
  );
};

export const getSalesOrderConvertList = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SALES_ORDER_CONVERT,
    params
  );
};

export const getListSalesOrderRequestInvoices = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_REQUEST_INVOICES_LIST,
    params
  );
};

export const getDetailSalesOrderRequestInvoices = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_REQUEST_INVOICES_DETAIL,
    params
  );
};

export const createSalesOrderRequestInvoices = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REQUEST_INVOICES_CREATE,
    params
  );
}

export const updateSalesOrderRequestInvoices = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REQUEST_INVOICES_UPDATE,
    params
  );
}

export const deleteSalesOrderRequestInvoices = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REQUEST_INVOICES_DELETE,
    params
  );
}

export const approveSalesOrderRequestInvoices = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REQUEST_INVOICES_APPROVE,
    params
  );
}

export const rejectSalesOrderRequestInvoices = async (params = {}) => {
  return await fnPostV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_POST_REQUEST_INVOICES_REJECT,
    params
  );
}

export const getListSearchSalesOrderRegistration = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_SEARCH_SALES_ORDER_LIST,
    params
  );
};

export const exportListSaleOrder = async (params = {}) => {
  return await fnGetV2(
    config.apiSalesOrderDomain,
    ConstantURL.API_URL_GET_EXPORT_EXCEL_SALES_ORDERS,
    params
  );
};

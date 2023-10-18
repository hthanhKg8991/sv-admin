import {fnGetV2, fnPostV2, fnPostForm} from "./index";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import {fakePaginate} from "api/index";

export const getListCategory = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_CATEGORY_LIST, params);
};
export const getListFullCategory = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_CATEGORY_LIST_FULL, params);
};
export const getDetailCategory = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_CATEGORY_DETAIL, params);
};
export const postCreateCategory = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_CATEGORY_CREATE, params);
};
export const postUpdateCategory = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_CATEGORY_UPDATE, params);
};
export const postActiveCategory = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_CATEGORY_ACTIVE, params);
};
export const postInActiveCategory = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_CATEGORY_INACTIVE, params);
};

export const getListSku = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SKU_LIST, params);
};
export const getListFullSku = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SKU_LIST_FULL, params);
};
export const getDetailSku = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SKU_DETAIL, params);
};
export const getDetailSkuBundle = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SKU_BUNDLE_DETAIL, params);
};
export const postCreateSku = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_CREATE, params);
};
export const postUpdateSku = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_UPDATE, params);
};
export const postActiveSku = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_ACTIVE, params);
};
export const postInActiveSku = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_INACTIVE, params);
};

export const getListProductPackage = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PRODUCT_PACKAGE_LIST, params);
};
export const getListFullProductPackage = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PRODUCT_PACKAGE_LIST_FULL, params);
};
export const getDetailProductPackage = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PRODUCT_PACKAGE_DETAIL, params);
};
export const postCreateProductPackage = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRODUCT_PACKAGE_CREATE, params);
};
export const postUpdateProductPackage = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRODUCT_PACKAGE_UPDATE, params);
};
export const postActiveProductPackage = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRODUCT_PACKAGE_ACTIVE, params);
};
export const postInActiveProductPackage = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRODUCT_PACKAGE_INACTIVE, params);
};

export const getListProductDetailPackage = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PRODUCT_PACKAGE_DETAIL_LIST, params);
};
export const getDetailProductDetailPackage = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PRODUCT_PACKAGE_DETAIL_DETAIL, params);
};
export const postCreateProductDetailPackage = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRODUCT_PACKAGE_DETAIL_CREATE, params);
};
export const postUpdateProductDetailPackage = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRODUCT_PACKAGE_DETAIL_UPDATE, params);
};
export const postDeleteProductDetailPackage = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRODUCT_PACKAGE_DETAIL_DELETE, params);
};

export const getListSalesOrderV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SALES_ORDER_V2_LIST, params);
};
export const getDetailSalesOrderV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SALES_ORDER_V2_DETAIL, params);
};
export const postCreateSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_CREATE, params);
};
export const postUpdateSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_UPDATE, params);
};
export const getListSalesOrderItemV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SALES_ORDER_ITEM_V2_LIST, params);
};

export const getListFullSalesOrderItemV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SALES_ORDER_ITEM_V2_LIST_FULL, params);
};
export const getDetailSalesOrderItemV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SALES_ORDER_ITEM_V2_DETAIL, params);
};
export const postCreateSalesOrderItemV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_ITEM_V2_CREATE, params);
};
export const postUpdateSalesOrderItemV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_ITEM_V2_UPDATE, params);
};
export const postDeleteSalesOrderItemV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_ITEM_V2_DELETE, params);
};

export const getListSkuPrice = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SKU_PRICE_LIST, params);
};
export const getDetailSkuPrice = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SKU_PRICE_DETAIL, params);
};
export const postCreateSkuPrice = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_PRICE_CREATE, params);
};
export const postUpdateSkuPrice = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_PRICE_UPDATE, params);
};
export const postActiveSkuPrice = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_PRICE_ACTIVE, params);
};
export const postInActiveSkuPrice = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_PRICE_INACTIVE, params);
};
export const deleteSkuPrice = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_PRICE_DELETE, params);
};

export const getListPriceList = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PRICE_LIST_LIST, params);
};
export const getDetailPriceList = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PRICE_LIST_DETAIL, params);
};
export const createPriceList = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRICE_LIST_CREATE, params);
};
export const updatePriceList = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRICE_LIST_UPDATE, params);
};
export const duplicatePriceList = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRICE_LIST_DUPLICATE, params);
};
export const deletePriceList = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRICE_LIST_DELETE, params);
};
export const activePriceList = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRICE_LIST_ACTIVE, params);
};
export const inactivePriceList = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PRICE_LIST_INACTIVE, params);
};

export const previewSalesOrderV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SALES_ORDER_V2_PREVIEW, params);
};
export const submitSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_SUBMIT, params);
};
export const confirmSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_CONFIRM, params);
};
export const duplicateSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_DUPLICATE, params);
};
export const deleteSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_DELETE, params);
};

export const approveSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_APPROVE, params);
};
export const rejectSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_REJECT, params);
};
export const approveDebtSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_APPROVE_DEBT, params);
};
export const rejectDebtSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_REJECT_DEBT, params);
};
export const requestApproveDebtSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_V2_REQUEST_APPROVE_DEBT, params);
};

export const getListPromotionV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PROMOTION_LIST, params);
};
export const getListBySalesOrderPromotion = async (params = {}) => {
    const res =  await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PROMOTION_LIST_BY_SALES_ORDER, params);
    return fakePaginate(res || []);
};
export const getDetailPromotionV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_PROMOTION_DETAIL, params);
};
export const createPromotionV2 = async (params = {}) => {
    return await fnPostForm(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PROMOTION_CREATE, params);
};
export const updatePromotionV2 = async (params = {}) => {
    return await fnPostForm(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PROMOTION_UPDATE, params);
};
export const deletePromotionV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PROMOTION_DELETE, params);
};
export const applyPromotionV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PROMOTION_APPLY, params);
};
export const togglePromotionV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_PROMOTION_TOGGLE, params);
};

export const getListEmployerResignV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_EMPLOYER_RESIGN_V2_LIST, params);
};
export const createEmployerResignV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_EMPLOYER_RESIGN_V2_CREATE, params);
};
export const deleteEmployerResignV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_EMPLOYER_RESIGN_V2_DELETE, params);
};
export const printSalesOrderOriginalV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_SALES_ORDER_V2_PRINT_CONTRACT_ORIGINAL, params);
};

export const getListExchangeSalesOrderV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_EXCHANGE_V2_LIST, params);
};
export const getDetailExchangeSalesOrderV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_EXCHANGE_V2_DETAIL, params);
};
export const createExchangeSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_EXCHANGE_V2_CREATE, params);
};
export const submitExchangeSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_EXCHANGE_V2_SUBMIT, params);
};
export const deleteExchangeSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_EXCHANGE_V2_DELETE, params);
};
export const approveExchangeSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_EXCHANGE_V2_APPROVE, params);
};
export const rejectExchangeSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_EXCHANGE_V2_REJECT, params);
};

export const getListByExchangeDetailSalesOrderV2 = async (params = {}) => {
    return await fnGetV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_GET_EXCHANGE_DETAIL_V2_LIST_BY_EXCHANGE, params);
};
export const createExchangeDetailSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_EXCHANGE_DETAIL_V2_CREATE, params);
};
export const deleteExchangeDetailSalesOrderV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_EXCHANGE_DETAIL_V2_DELETE, params);
};
export const postCreateSkuBundle = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_BUNDLE_CREATE, params);
};
export const postUpdateSkuBundle = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SKU_BUNDLE_UPDATE, params);
};

export const salesOrderChangeBranchCodeV2 = async (params = {}) => {
    return await fnPostV2(config.apiSalesOrderV2Domain, ConstantURL.API_URL_POST_SALES_ORDER_CHANGE_BRANCH_CODE_V2, params);
};
import moment from "moment";
import * as Constant from "utils/Constant";
import configForm from "config/form";
import configSite from "config/configSite";
import _ from "lodash";

export const deleteQueryNotUsed = (query) => {
  let data = query;
  delete data["page"];
  delete data["per_page"];
  delete data["show_popup"];
  delete data["debug"];
  delete data["item_active"];
  delete data["action_active"];
  Object.keys(data).forEach((item) => {
    if (item.indexOf("order_by") >= 0) {
      delete data[item];
    }
  });
  return data;
};

export const convertArrayValueCommonData = (commonData, keyCommonData) => {
  let data = [];
  if (commonData && commonData[keyCommonData]) {
    Object.values(commonData[keyCommonData]).forEach((item) => {
      data.push({ value: item.value, title: item.name });
    });
  }
  return data;
};

export const convertArrayValueCommonDataFull = (commonData, keyCommonData) => {
  let data = [];
  if (commonData && commonData[keyCommonData]) {
    Object.values(commonData[keyCommonData]).forEach((item) => {
      data.push({ ...item, value: item.value, title: item.name });
    });
  }
  return data;
};

export const convertObjectValueCommonData = (commonData, keyCommonData) => {
  let data = {};
  if (commonData && commonData[keyCommonData]) {
    Object.values(commonData[keyCommonData]).forEach((item) => {
      data[item.value] = item.name;
    });
  }
  return data;
};

export const convertToDataFilter = (staffList) => {
  let data = [];
  if (staffList) {
    Object.values(staffList).forEach((item) => {
      data.push({ ...item, value: item.id, title: item.login_name });
    });
  }
  return data;
};

export const textCommon = (commonData, keyCommonData, valueCommonData) => {
  return convertObjectValueCommonData(commonData, keyCommonData)[valueCommonData] || "";
};

export const convertObjectValueCommonDataFull = (commonData, keyCommonData) => {
  let data = {};
  if (commonData && commonData[keyCommonData]) {
    Object.values(commonData[keyCommonData]).forEach((item) => {
      data[item.value] = item;
    });
  }
  return data;
};

export const convertArrayToObject = (input, key) => {
  let data = {};
  if (input) {
    input.forEach((item) => {
      data[item[key]] = item;
    });
  }
  return data;
};

export const formatNumber = (number, tofix = 0, symbol = ",", typeMoney = "") => {
  let kq = "";
  if (!parseInt(number) && parseInt(number) !== 0) {
    return typeMoney ? 0 + " " + typeMoney : 0;
  }
  if (!tofix) {
    kq = parseInt(number)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&" + symbol);
    kq = kq.substr(0, kq.length - 3);
  } else {
    kq = parseInt(number)
      .toFixed(tofix)
      .replace(/\d(?=(\d{3})+\.)/g, "$&" + symbol);
  }
  return typeMoney ? kq + " " + typeMoney : kq;
};

export const formatNumberWithDecimal = (number, tofix = 0, symbol = ",", typeMoney = "") => {
  let kq = "";
  if (!parseInt(number) && parseInt(number) !== 0) {
    return typeMoney ? 0 + " " + typeMoney : 0;
  }
  if (!tofix) {
    kq = parseInt(number)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&" + symbol);
    kq = kq.substr(0, kq.length - 3);
  } else {
    kq = Number(number)
      .toFixed(tofix)
      .replace(/\d(?=(\d{3})+\.)/g, "$&" + symbol);
  }
  return typeMoney ? kq + " " + typeMoney : kq;
};

export const formatNumberVer2 = (number, tofix = 0, symbol = ",", typeMoney = "") => {
  let kq = "";
  if (!parseInt(number, 10) && parseInt(number, 10) !== 0) {
    return typeMoney ? `${0} ${typeMoney}` : "";
  }
  if (!tofix) {
    kq = parseInt(number, 10)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, `$&${symbol}`);
    kq = kq.substr(0, kq.length - 3);
  } else {
    kq = parseInt(number, 10)
      .toFixed(tofix)
      .replace(/\d(?=(\d{3})+\.)/g, `$&${symbol}`);
  }
  return typeMoney ? `${kq} ${typeMoney}` : kq;
};

export const convertNumberToWeekDay = (number) => {
  if (!parseInt(number)) {
    return "0 ngày";
  }
  let n = parseInt(number);
  let week = parseInt(n / 7) ? parseInt(n / 7) : 0;
  let day = parseInt(n % 7) ? parseInt(n % 7) : 0;
  let kq = "";
  if (week) {
    kq = week + " tuần ";
  }
  if (day) {
    kq += day + " ngày";
  }
  return kq;
};

export const checkOnSaveRequired = (data, required) => {
  let e = {
    fields: {},
  };
  try {
    if (!required.length) {
      return { error: 0, field: "" };
    }
    for (let i = 0; i < required.length; i++) {
      if (!data[required[i]] || (Array.isArray(data[required[i]]) && !data[required[i]].length)) {
        if (!e.error) {
          e.error = 1;
          e.field = required[i];
        }
        e.fields[required[i]] = "Thông tin là bắt buộc";
      }
    }
    return e;
  } catch (e) {
    console.log(e);
    return { error: 1, field: "", fields: {} };
  }
};

export const checkOnSaveRequired1InAll = (data, required) => {
  try {
    if (!required.length) {
      return false;
    }
    for (let i = 0; i < required.length; i++) {
      if (data[required[i]] || (Array.isArray(data[required[i]]) && data[required[i]].length)) {
        return false;
      }
    }
    return true;
  } catch (e) {
    console.log(e);
    return true;
  }
};

export const getListWeekInYear = (year = moment().year()) => {
  let curr = moment().year(year);
  let firstDay = moment(curr).startOf("year");
  let endDay = moment(curr).endOf("year");
  let numberWeek = parseInt((endDay.diff(firstDay, "days") + 1) / 7);
  let weeks = [];
  for (let i = 1; i <= numberWeek; i++) {
    let value = (i >= 10 ? i : "0" + i) + "/" + curr.format("YYYY");
    let title = (i >= 10 ? i : "0" + i) + "/" + curr.format("YYYY");
    if (i === 1) {
      title =
        title + " (" + firstDay.format("DD/MM") + " - " + moment(curr).week(i).isoWeekday(6).format("DD/MM/YYYY") + ")";
    } else {
      if (i === numberWeek) {
        title =
          title +
          " (" +
          moment(curr).week(i).isoWeekday(1).format("DD/MM") +
          " - " +
          moment(endDay).format("DD/MM/YYYY") +
          ")";
      } else {
        title =
          title +
          " (" +
          moment(curr).week(i).isoWeekday(1).format("DD/MM") +
          " - " +
          moment(curr).week(i).isoWeekday(7).format("DD/MM/YYYY") +
          ")";
      }
    }
    weeks.push({ value: value, title: title });
  }
  return weeks;
};

export const getListWeekInMonth = (month = moment().month(), fullday = false) => {
  let curr = moment().month(month);
  let firstDay = moment(curr).startOf("month");
  let endDay = moment(curr).endOf("month");

  let startWeek = moment(firstDay).isoWeeks();
  let endWeek = moment(endDay).isoWeeks();

  let numberWeek = parseInt((moment(curr).endOf("year").diff(moment(curr).startOf("year"), "days") + 1) / 7);

  if (endWeek === 1) {
    endWeek = numberWeek + 1;
  }

  let weeks = [];
  for (let i = startWeek; i <= endWeek; i++) {
    let title = "";
    if (i === startWeek && !fullday) {
      title = title + "(" + firstDay.format("DD/MM") + " - " + moment(curr).week(i).isoWeekday(7).format("DD/MM") + ")";
    } else {
      if (i === endWeek && !fullday) {
        title =
          title +
          "(" +
          moment(curr).week(i).isoWeekday(1).format("DD/MM") +
          " - " +
          moment(endDay).format("DD/MM") +
          ")";
      } else {
        title =
          title +
          "(" +
          moment(curr).week(i).isoWeekday(1).format("DD/MM") +
          " - " +
          moment(curr).week(i).isoWeekday(7).format("DD/MM") +
          ")";
      }
    }
    weeks.push({ value: i, title: title });
  }
  return weeks;
};

export const getDayInWeek = (week = moment().week()) => {
  let curr = moment().week(week);
  let days = [];
  for (let i = 1; i < 8; i++) {
    let title = i > 6 ? "Chủ nhật" : "Thứ " + (i + 1);
    let date = moment(curr).isoWeekday(i).format("DD/MM/YYYY");
    days.push({ date: date, title: title });
  }
  return days;
};

export const getListMonthInYear = (year = moment().year()) => {
  let months = [];
  let curr = moment().year(year);
  for (let i = 0; i < 12; i++) {
    let curr_month = moment(curr).month(i);
    let value = curr_month.format("MM/YYYY");
    let title =
      value +
      " (" +
      curr_month.startOf("month").format("DD/MM") +
      " - " +
      curr_month.endOf("month").format("DD/MM") +
      ")";
    months.push({ value: value, title: title });
  }
  return months;
};

export const validateEmail = (email) => {
  let regEmail = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
  return regEmail.test(email)
};

export const validateEmailV2 = (email) => {
  let regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/

  return regEmail.test(email)
}

export const getListYear = (number = 30) => {
  let curr = moment();
  let years = [];
  for (let i = 0; i < number; i++) {
    let year = moment(curr).subtract(i, "year").format("YYYY");
    years.push({ value: year, title: year });
  }
  return years;
};

export const getOptionYear = (number = 30) => {
  let curr = moment();
  let years = [];
  for (let i = 0; i < number; i++) {
    let year = moment(curr).subtract(i, "year").format("YYYY");
    years.push({ value: parseInt(year), label: year });
  }
  return years;
};

export const readThirdNumber = (baso) => {
  let ChuSo = [" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín "];
  let tram;
  let chuc;
  let donvi;
  let KetQua = "";
  tram = parseInt(baso / 100);
  chuc = parseInt((baso % 100) / 10);
  donvi = baso % 10;
  if (tram === 0 && chuc === 0 && donvi === 0) return "";
  if (tram !== 0) {
    KetQua += ChuSo[tram] + " trăm ";
    if (chuc === 0 && donvi !== 0) KetQua += " linh ";
  }
  if (chuc !== 0 && chuc !== 1) {
    KetQua += ChuSo[chuc] + " mươi";
    if (chuc === 0 && donvi !== 0) KetQua = KetQua + " linh ";
  }
  if (chuc === 1) KetQua += " mười ";
  switch (donvi) {
    case 1:
      if (chuc !== 0 && chuc !== 1) {
        KetQua += " mốt ";
      } else {
        KetQua += ChuSo[donvi];
      }
      break;
    case 5:
      if (chuc === 0) {
        KetQua += ChuSo[donvi];
      } else {
        KetQua += " lăm ";
      }
      break;
    default:
      if (donvi !== 0) {
        KetQua += ChuSo[donvi];
      }
      break;
  }
  return KetQua;
};

export const readMoneyToWord = (SoTien) => {
  let Tien = ["", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ"];
  let lan = 0;
  let i = 0;
  let so = 0;
  let KetQua = "";
  let tmp = "";
  let ViTri = [];
  if (SoTien < 0) return "Số tiền âm !";
  if (!SoTien || SoTien === 0) return "";
  if (SoTien > 0) {
    so = SoTien;
  } else {
    so = -SoTien;
  }
  if (SoTien > 8999999999999999) {
    //SoTien = 0;
    return "Số quá lớn!";
  }
  ViTri[5] = Math.floor(so / 1000000000000000);
  if (isNaN(ViTri[5])) ViTri[5] = "0";
  so = so - parseFloat(String(ViTri[5])) * 1000000000000000;
  ViTri[4] = Math.floor(so / 1000000000000);
  if (isNaN(ViTri[4])) ViTri[4] = "0";
  so = so - parseFloat(String(ViTri[4])) * 1000000000000;
  ViTri[3] = Math.floor(so / 1000000000);
  if (isNaN(ViTri[3])) ViTri[3] = "0";
  so = so - parseFloat(String(ViTri[3])) * 1000000000;
  ViTri[2] = parseInt(so / 1000000);
  if (isNaN(ViTri[2])) ViTri[2] = "0";
  ViTri[1] = parseInt((so % 1000000) / 1000);
  if (isNaN(ViTri[1])) ViTri[1] = "0";
  ViTri[0] = parseInt(so % 1000);
  if (isNaN(ViTri[0])) ViTri[0] = "0";
  if (ViTri[5] > 0) {
    lan = 5;
  } else if (ViTri[4] > 0) {
    lan = 4;
  } else if (ViTri[3] > 0) {
    lan = 3;
  } else if (ViTri[2] > 0) {
    lan = 2;
  } else if (ViTri[1] > 0) {
    lan = 1;
  } else {
    lan = 0;
  }
  for (i = lan; i >= 0; i--) {
    tmp = readThirdNumber(ViTri[i]);
    KetQua += tmp;
    if (ViTri[i] > 0) KetQua += Tien[i];
    if (i > 0 && tmp.length > 0) KetQua += ","; //&& (!string.IsNullOrEmpty(tmp))
  }
  if (KetQua.substring(KetQua.length - 1) === ",") {
    KetQua = KetQua.substring(0, KetQua.length - 1);
  }
  KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
  return KetQua; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
};

export const compareObject = (object, object_revision) => {
  delete object_revision["id"];
  if (Object.entries(object).length === 0) {
    return object_revision;
  }
  Object.keys(object).forEach((name) => {
    if (object_revision[name] || object_revision[name] === "") {
      object[name] = object_revision[name];
    }
  });
  return object;
};

export const parseStatus = (status, r_status) => {
  if (![Constant.STATUS_ACTIVED, Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(parseInt(status))) {
    return parseInt(status);
  }
  let tmp_status = r_status ? `${status}${r_status}` : `${status}`;
  tmp_status = tmp_status.replace("11", "1").replace("22", "2").replace("33", "3");
  return parseInt(tmp_status);
};

export const getBreadcrumbs = (pathname, navigation = {}, child = [], breadcrumbs = []) => {
  child.forEach((item) => {
    if (item.url === pathname) {
      if (navigation.name) breadcrumbs.push(navigation.name);
      if (item.name) breadcrumbs.push(item.name);
      return breadcrumbs;
    } else {
      if (item.child) {
        getBreadcrumbs(pathname, item, item.child, breadcrumbs);
      }
    }
  });
  return breadcrumbs;
};

export const getNextRunDate = (from_date, frequency, last_sent_on = null, format = "DD/MM/YYYY") => {
  frequency = parseInt(frequency);
  let ignore_last_sent_on = false;
  if (!last_sent_on) {
    last_sent_on = moment();
  } else {
    last_sent_on = moment.unix(last_sent_on);
    ignore_last_sent_on = true;
  }

  let date = moment.unix(from_date);
  let duration = moment.duration(last_sent_on.diff(date));

  let diff_days = Math.ceil(duration.asDays() / frequency) * frequency;

  if (ignore_last_sent_on && diff_days % frequency === 0) {
    diff_days += frequency;
  }

  return date.add(diff_days, "days").format(format);
};

export const calcDate = (start_date, week_quantity = 0, day_quantity = 0, format = "DD/MM/YYYY") => {
  if (start_date) {
    let date = moment.unix(start_date);
    let day = parseInt(week_quantity) * 7;
    day = day + parseInt(day_quantity);
    day = day ? day - 1 : day;
    date = date.add(day, "days");
    return date.format(format);
  }
  return null;
};

export const urlFile = (url_file, url_cdn) => {
  if (url_file === null) {
    return null;
  }
  if (url_file.indexOf("http://") >= 0 || url_file.indexOf("https://") >= 0) {
    return url_file;
  }
  return `${url_cdn}${url_file}`;
};

export const compare = (data, data_compare) => {
  return JSON.stringify(data) !== JSON.stringify(data_compare);
};

export const getConfigForm = (channelCode, path) => {
  const config = _.get(configForm, path.split("."), null);

  if (_.has(config, channelCode)) {
    return _.get(config, channelCode);
  }

  const configPriorityReplace = _.get(configSite, channelCode, ["default"]);

  let configByChannel;
  for (let item of configPriorityReplace) {
    if (_.has(config, item)) {
      configByChannel = _.get(config, item);
      break;
    }
  }

  if (_.isEmpty(configByChannel)) {
    configByChannel = _.get(config, "default", null);
  }

  return configByChannel;
};

export const initFormKey = (config) => {
  return _.mapValues(config, () => {
    return "";
  });
};

export const initFormValue = (config, data) => {
  let result = {};
  _.forEach(config, (value, key) => {
    result[key] = _.get(data, value);
  });

  return result;
};

export const mapOptionDroplist = (data, labelField, valueField) => {
  return _.map(data, (item) => {
    return {
      value: _.get(item, valueField),
      label: _.get(item, labelField),
    };
  });
};

export const getDataDocumentGuild = (data, labelField, valueField) => {
  return _.map(data, (item) => {
    return {
      value: _.get(item, valueField),
      label: _.get(item, labelField),
    };
  });
};

const customMerge = (a, b, c) => {
  // Merge Deep
  if (_.isObject(b) && c === "job_contact_info") {
    return _.mergeWith({}, a, b, customMerge);
  }
  if (_.isArray(b)) {
    return b;
  }
  if (b === null || (!b && b !== 0)) {
    return a;
  }
  return b;
};

export const getMergeDataRevision = (origin, revision) => {
  let mergeData = { ...origin };
  mergeData.revision_status = revision?.revision_status;
  if (_.get(revision, "revision_status") === Constant.STATUS_INACTIVED && revision) {
    mergeData = _.mergeWith({}, origin, revision, customMerge);

    //custom: contact_info
    if (mergeData?.contact_info) {
      mergeData.contact_info = _.mergeWith({}, origin?.contact_info, revision?.contact_info, customMerge);
    }
    mergeData.id = origin?.id;
  }
  return mergeData;
};

export const stringToSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a")
    .replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e")
    .replace(/(ì|í|ị|ỉ|ĩ)/g, "i")
    .replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o")
    .replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u")
    .replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y")
    .replace(/(đ)/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/^-+/g, "")
    .replace(/-+$/g, "");
};

export const getBannerType = (serviceCode) => {
  if (!serviceCode) {
    return null;
  }
  let type = "";
  if (serviceCode.indexOf(Constant.BANNER_HANG_DAU) > -1) {
    type = Constant.BANNER_HANG_DAU;
  } else if (serviceCode.indexOf(Constant.BANNER_COVER_TRANG_CHU) > -1) {
    type = Constant.BANNER_COVER_TRANG_CHU;
  } else if (serviceCode.indexOf(Constant.BANNER_PHAI_TRANG_CONG) > -1) {
    type = Constant.BANNER_PHAI_TRANG_CONG;
  } else if (serviceCode.indexOf(Constant.BANNER_PHAI_TRANG_NGANH) > -1) {
    type = Constant.BANNER_PHAI_TRANG_NGANH;
  } else if (serviceCode.indexOf(Constant.BANNER_TRANG_CHU) > -1) {
    type = Constant.BANNER_TRANG_CHU;
  } else if (serviceCode.indexOf(Constant.BANNER_TRUNG_TAM) > -1) {
    type = Constant.BANNER_TRUNG_TAM;
  } else if (serviceCode.indexOf(Constant.BANNER_PHAI_TRANG_CHU) > -1) {
    type = Constant.BANNER_PHAI_TRANG_CHU;
  } else if (serviceCode.indexOf(Constant.BANNER_LOGO_NOI_BAT_TRANG_CHU) > -1) {
    type = Constant.BANNER_LOGO_NOI_BAT_TRANG_CHU;
  }

  return type;
};

// const setCookie = (name, value, days = 300, path = '/') => {
//     const expires = new Date(Date.now() + days * 864e5).toUTCString()
//     document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path
// };

const getCookie = (name) => {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
};

// const deleteCookie = (name, path) => {
//     setCookie(name, '', -1, path)
// };

export const isDebug = () => {
  const debug = getCookie("dev");
  return debug === "2020";
};

export const transformSalaryRange = (number) => {
  if (!number) {
    return 0;
  }
  let mod = 10;
  let count = 0;
  const unit = ["", "0", "00", " nghìn", "0 nghìn", "00 nghìn", " triệu", "0 triệu", "00 triệu", " tỷ"];
  while (number % mod === 0) {
    count++;
    mod *= 10;
  }
  const firstNumber = number / Math.pow(10, count);
  return `${firstNumber}${unit[count]}`;
};

export const getCodeEmailAccountantServiceByBranchCode = (branchCode) => {
  if (branchCode) {
    if (branchCode.includes("north")) {
      return Constant.CONFIG_EMAIL_ACCOUNT_SERVICE_CONTROL_NORTH;
    } else if (branchCode.includes("south")) {
      return Constant.CONFIG_EMAIL_ACCOUNT_SERVICE_CONTROL_SOUTH;
    }
    return null;
  }
  return null;
};

export const translateMomentFromNow = (fromNow) => {
  return fromNow
    .replace("years ago", "năm trước")
    .replace("a year ago", "1 năm trước")
    .replace("months ago", "tháng trước")
    .replace("a month ago", "1 tháng trước")
    .replace("days ago", "ngày trước")
    .replace("a day ago", "1 ngày trước")
    .replace("hours ago", "giờ trước")
    .replace("an hour ago", "1 giờ trước")
    .replace("minutes ago", "phút trước")
    .replace("a minute ago", "1 phút trước");
};

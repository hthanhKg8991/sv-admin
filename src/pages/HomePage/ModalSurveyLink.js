import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import _ from "lodash";
import * as Constant from "utils/Constant";
import { getListSurveyJsAnswer } from "api/survey";

const ModalSurveyLink = (props) => {
  const [show, setShow] = useState(false);
  const { user } = props;
  const divisionCode = _.get(user, 'division_code', null);
  const userId = _.get(user, ['data', 'id'], null);

  const handleClose = () => {
    setShow(false);
  }

  const onRedirect = () => {

    // Là kế toán 
    if ([Constant.DIVISION_TYPE_accountant_liabilities, Constant.DIVISION_TYPE_accountant_invoice, Constant.DIVISION_TYPE_accountant_service_control].includes(divisionCode)) {
      window.location.href = `/survey?action=detail&id=5&referralFrom=${Constant.REFERRAL_FROM_HOME_PAGE}`;
    } else if ([Constant.DIVISION_TYPE_regional_sales_leader, Constant.DIVISION_TYPE_customer_care_member, Constant.DIVISION_TYPE_customer_care_leader]) {
      // Là sale 
      window.location.href = `/survey?action=detail&id=1&referralFrom=${Constant.REFERRAL_FROM_HOME_PAGE}`;
    }
  }

  const checkSurvey = useCallback( async () => {
    let idSurvey = 1; // Mặc định id survey = 1, phân quyền theo sale (Task SO-98)
    // Hard id survey trên FE để truyền xuống BE check

    if ([Constant.DIVISION_TYPE_accountant_liabilities, Constant.DIVISION_TYPE_accountant_invoice, Constant.DIVISION_TYPE_accountant_service_control].includes(divisionCode)) {
      idSurvey = 5;
    }

    const res = await getListSurveyJsAnswer({ surveyjs_question_id: idSurvey, uid: `-0-${userId}` });
    
    if (res?.items?.length === 0) {
      setShow(true);
    }
  } ,[divisionCode, userId])

  useEffect(() => {
    checkSurvey();
  }, [checkSurvey])

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center text-uppercase font-bold">Welcome to Siêu Việt</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <span className="fs16">
          Nhằm mục đích đánh giá hiệu quả quy trình thanh toán QR code từ sale và kế toán.
          Team triển khai tính năng khảo sát để lấy ý kiến từ các bộ phận.
          Sự hợp tác của các bạn góp phần giúp đỡ team trong quá trình phát triển dự án.
          Xin cảm ơn!
        </span>
        <div className="text-center mt20">
          <button type="button" className="btn btn-success font-bold mr15" onClick={onRedirect}>Tham gia ngay</button>
          <button type="button" className="btn btn-danger font-bold" onClick={handleClose}>Bỏ qua</button>
        </div>
      </Modal.Body>
    </Modal>
  )
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(ModalSurveyLink);
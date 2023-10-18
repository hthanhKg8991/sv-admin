import React, { Component } from "react";

class JobDetail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { jobDetail } = this.props;

    return (
      <div className="dialog-popup-body">
        <div className="popupContainer">
          <div className="form-container">
            <div className="row mb10">
              <div className="col-sm-2">Tên công ty:</div>
              <div className="col-sm-10">{jobDetail?.companyName}</div>
            </div>
            <div className="row mb10">
              <div className="col-sm-2">Tên công việc:</div>
              <div className="col-sm-10">{jobDetail?.jobName}</div>
            </div>
            <div className="row mb10">
              <div className="col-sm-2">Cấp bậc:</div>
              <div className="col-sm-10">{jobDetail?.level}</div>
            </div>
            <div className="row mb10">
              <div className="col-sm-2">Ngành nghề:</div>
              <div className="col-sm-10">
                {jobDetail?.fieldName &&
                  jobDetail?.fieldName.map((value) => value + ", ")}
              </div>
            </div>
            <div className="row mb10">
              <div className="col-sm-2">Khu vực tuyển:</div>
              <div className="col-sm-10">
                {jobDetail?.location && (
                  <ul>
                    {jobDetail?.location?.map((location) => (
                      <li>{location}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {jobDetail?.content && (
              <div className="row mb10">
                <div className="col-sm-2">Mô tả công việc:</div>
                <div className="col-sm-10">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: jobDetail?.content?.replaceAll("\n", `<br/>`),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <style jsx>{}</style>
      </div>
    );
  }
}

export default JobDetail;

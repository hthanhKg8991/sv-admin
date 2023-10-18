import React, { Component } from "react";

class Detail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { detail } = this.props;

    return (
      <div className="dialog-popup-body">
        <div className="popupContainer">
          {detail?.content && (
            <div
              dangerouslySetInnerHTML={{
                __html: detail?.content,
              }}
            />
          )}
        </div>
        <style jsx>{`
          .popupContainer {
            padding-top: 20px;
            height: 500px;
            overflow: scroll;
          }
        `}</style>
      </div>
    );
  }
}

export default Detail;

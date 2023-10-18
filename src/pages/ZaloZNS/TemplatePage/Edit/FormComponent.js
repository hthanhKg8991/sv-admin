import React from "react";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";

class FormComponent extends React.Component {
    render() {
        const {values} = this.props;
        const {data} = values;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mt10 mb10">
                        <span>Thông tin chung</span>
                    </div>
                    <div className="col-sm-12 ml10 mt10 mb10">
                        <div><span className="font-bold">- List Params: </span>{data.list_params?.map((v, i) => (i !== data.list_params.length - 1) ?
                            <span className="ml5" key={i}>{`${v.name},`}</span> :
                            <span className="ml5" key={i}>{v.name}</span>)}</div>
                        <div><span className="font-bold">- Preview Url: </span><span>{data.preview_url}</span></div>
                        <div><span className="font-bold">- Template Quality: </span><span>{data.quality}</span></div>
                        <div><span className="font-bold">- Template Tag: </span><span>{data.tag}</span></div>
                        <div><span className="font-bold">- Price: </span><span>{data.price}</span></div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mt10 mb10">
                        <span>Nội dung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyCKEditor
                            config={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['Link'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                            label={"Content"}
                            name="content"
                            showLabelRequired
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;

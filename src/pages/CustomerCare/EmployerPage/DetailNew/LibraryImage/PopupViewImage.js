import React,{Component} from "react";

class PopupViewImage extends Component {
    render() {
        let {path} = this.props;

        return (
            <div className="d-flex">
                <img src={path} alt={path} style={{maxHeight: "75vh"}} className="img-responsive m-auto p-3"/>
            </div>
        )
    }
}
export default PopupViewImage;

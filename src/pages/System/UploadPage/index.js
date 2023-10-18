import React, {Component} from "react";
import DropzoneIMG from "components/Common/Ui/DropzoneIMG";

class index extends Component {
    constructor(props) {
        super(props);
        this.onAdd = this._onAdd.bind(this);
        this.state = {
            list: [0],
        }
    }

    _onAdd() {
        const {list} = this.state;
        this.setState({
            list: [...list, list.length]
        })
    }


    render() {
        return (
            <div className="col-result-full">
                <div className="box-card box-full">
                    <div className="card-body" style={{minHeight: "300px"}}>
                        {this.state.list.map(_ => (
                            <DropzoneIMG label={"Ảnh"}
                                         key={_}
                                         name={"file"}
                                         prefix={"public"}
                                         folder={"public"}/>
                        ))}
                        <button onClick={this.onAdd} type="button"
                                className="el-button el-button-primary el-button-small"><span>Thêm <i
                            className="glyphicon glyphicon-plus"/></span></button>
                    </div>
                </div>
            </div>
        )
    }
}


export default index;

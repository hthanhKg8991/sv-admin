import React, {Component} from "react";
import _ from "lodash";
import {getCustomerListNewIgnoreChannelCode} from "api/auth";

class EmployerCorssSellingStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listCustomer: []
        };
    }

    async _getCustomerListNewIgnoreChannelCode() {
        const res = await getCustomerListNewIgnoreChannelCode({
            execute: 1,
            // scopes: 1,
            // has_room: 1,
            // includes: "team,room",
            // withTeam: 1,
        });

        if (res) {
            this.setState({
                listCustomer: res
            })
        }
    }

    componentDidMount() {
        this._getCustomerListNewIgnoreChannelCode();
    }

    render () {
        const {employer} = this.props;
        const crossSaleAssginId = _.get(employer, 'cross_sale_assign_id');
        let labelEmailCrossSelling = null;

        if (this.state.listCustomer.length > 0) {
            let isFound = false;
            this.state.listCustomer.forEach((item) => {
                if (!isFound && Number(item.id) === Number(crossSaleAssginId)) {
                    labelEmailCrossSelling = item.login_name;
                    isFound = true;
                }
            })
        }

        return (
            <>
            {
                labelEmailCrossSelling 
                ? 
                    (<div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Nhân viên cross selling</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{labelEmailCrossSelling}</span>
                        </div>
                    </div>) 
                : null
            }
                
            </>
        )
    }
}

export default EmployerCorssSellingStaff;

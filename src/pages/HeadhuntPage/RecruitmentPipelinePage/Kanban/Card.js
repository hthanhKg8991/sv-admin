import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {
    MovableCardWrapper,
    CardHeader,
    CardRightContent,
    CardTitle,
    Detail,
    Footer
} from 'react-trello/dist/styles/Base'
import InlineInput from 'react-trello/dist/widgets/InlineInput'
import Tag from 'react-trello/dist/components/Card/Tag'
import Popover from "@material-ui/core/Popover";
import moment from "moment";
import {formatNumber} from "utils/utils";
import Checkbox from "@material-ui/core/Checkbox";
class Card extends Component {
    state = {
        show: false,
        target: null,
    }
    handleClose = e => {
        this.setState({
            show: false,
            target: null,
        })
        e.stopPropagation()
    }

    handleClick = (event) => {
        this.setState({
            show: !this.state.show,
            target: event.target,
        })
        event.stopPropagation();
    };

    render() {
        const {
            showDeleteButton,
            style,
            tagStyle,
            onClick,
            onChange,
            className,
            id,
            title,
            changeStatus,
            onClickHistory,
            label,
            guarantee_applicant_id,
            tags,
            cardDraggable,
            editable,
            metadata,
            t,
            onAddHistoryInterview,
            stateChecked
        } = this.props

        const onChangeStatus = () => {
            changeStatus(metadata);
        }

        const clickViewLog = () => {
            onClickHistory(metadata);
        }

        const clickAddHistoryInterview = () => {
            onAddHistoryInterview(metadata);
        }
        const updateCard = (card) => {
            onChange({...card, id})
        }
        const passOnClick = (e) => {
            this.setState({
                show: false,
                target: null,
            })
            onClick(e);
        }
        const [checked, setToggleChecked] = stateChecked;
        return (
            <MovableCardWrapper
                data-id={id}
                onClick={passOnClick}
                style={style}
                className={className}
            >
                <CardHeader>
                    <CardTitle draggable={cardDraggable}>
                        {editable ?
                            <InlineInput value={title} border placeholder={t('placeholder.title')} resize='vertical'
                                         onSave={(value) => updateCard({title: value})}/> :
                            <div className="text-overflow-ellip">
                                {title}
                            </div>}
                    </CardTitle>
                    <CardRightContent>

                        {editable ?
                            <InlineInput value={label} border placeholder={t('placeholder.label')} resize='vertical'
                                         onSave={(value) => updateCard({label: value})}/> : label}
                    </CardRightContent>
                    <Popover
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        anchorEl={this.state.target}
                        id={id}
                        open={this.state.show}
                    >
                        <div className="row" onClick={this.handleClose}>
                            <div className="col-md-12 ml10 mr10 border-bottom margin-top-10">
                                <div onClick={onChangeStatus} className="mb10 text-bold cursor-pointer">
                                    <i className="fa fa-exchange mr5"/>Đổi trạng thái
                                </div>
                                <div onClick={clickViewLog} className="mb10 text-bold cursor-pointer">
                                    <i className="fa fa-history mr5"/>Xem lịch sử
                                </div>
                                <div onClick={clickAddHistoryInterview} className="mb10 text-bold cursor-pointer">
                                    <i className="fa fa-list mr5"/>Thêm action
                                </div>
                            </div>
                        </div>
                    </Popover>
                    {showDeleteButton &&
                    <div onClick={this.handleClick}><i className="fa fa-bars fs18 btn-bars"/></div>}
                    <Checkbox
                        color="primary"
                        classes={{root: 'custom-checkbox-root'}}
                        inputProps={{'aria-label': 'secondary checkbox'}}
                        checked={checked.includes(+id)}
                        onChange={()=> setToggleChecked(+id)}
                        style={{marginTop: "-10px", marginRight: "-10px"}}
                    />
                </CardHeader>
                <Detail>
                    <div>{`${metadata?.applicant_action_info?.action_name} Date: ${moment.unix(metadata?.applicant_action_info?.date_at).format("DD/MM/YYYY")}`}</div>

                    {metadata?.applicant_action_info?.result && metadata.applicant_action_info.result !== "" && (
                        <div>{`Result: ${metadata?.applicant_action_info?.result}`}</div>
                    )}
                    {metadata?.applicant_action_info?.reason && metadata.applicant_action_info.reason !== "" && (
                        <div>{`Reason: ${metadata?.applicant_action_info?.reason}`}</div>
                    )}
                    {metadata?.applicant_action_info?.note && metadata.applicant_action_info.note !== "" && (
                        <div>{`Note: ${metadata?.applicant_action_info?.note}`}</div>
                    )}
                    {metadata?.revenue_expected > 0 && (
                        <div>{`Expected: ${formatNumber(metadata.revenue_expected, 0, '.', 'đ')}`}</div>
                    )}
                    {metadata?.revenue_actual > 0 && (
                        <div>{`Actual revenue: ${formatNumber(metadata.revenue_actual, 0, '.', 'đ')}`}</div>
                    )}
                    {metadata?.recruiter_staff_login_name && (
                        <div>{`Recruiter: ${metadata.recruiter_staff_login_name}`}</div>
                    )}
                    {guarantee_applicant_id > 0 && (
                        <span className="text-italic font-bold mt10">(Ứng viên bảo hành)</span>
                    )}
                </Detail>
                <Footer>
                    {metadata?.channel_code && (
                        <Tag title={metadata?.channel_code?.toUpperCase()?.replace("SV", "KHÁC")} tagStyle={{backgroundColor: "#3276b1"}}/>
                    )}
                    {tags?.length > 0 && tags.map(tag => (
                        <Tag key={tag.title} {...tag} tagStyle={tagStyle}/>
                    ))}
                </Footer>


            </MovableCardWrapper>
        )
    }
}

Card.propTypes = {
    showDeleteButton: PropTypes.bool,
    onDelete: PropTypes.func,
    onClick: PropTypes.func,
    style: PropTypes.object,
    tagStyle: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
    stateChecked: PropTypes.array,
}

Card.defaultProps = {
    showDeleteButton: true,
    onDelete: () => {
    },
    onClick: () => {
    },
    style: {},
    tagStyle: {},
    title: 'no title',
    description: '',
    label: '',
    tags: [],
    className: '',
}

export default Card

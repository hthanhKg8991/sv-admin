import React from "react";
import Dropzone from 'react-dropzone';
import _ from "lodash";
import PropTypes from "prop-types";
import {uploadFile, uploadImage} from "api/cdn";

class DropzoneIMG extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            link: null,
            hasCopy: false,
            hasOpen: false,
        };
        this.onDrop = this._onDrop.bind(this);
        this.onOpen = this._onOpen.bind(this);
        this.onCopy = this._onCopy.bind(this);
    }

    _onOpen() {
        const {link} = this.state;
        if (!link) {
            alert("Hiện tại chưa có link!")
        }
        this.setState({hasOpen: true})
        window.open(link);
    }

    _onCopy() {
        const {link} = this.state;
        if (!link) {
            alert("Hiện tại chưa có link!")
        }
        navigator.clipboard.writeText(link);
        this.setState({hasCopy: true})
    }

    _onDrop(files) {
        const file = _.get(files, '0');
        if (file) {
            this.asyncUploadImage(file);
        }
    }

    async asyncUploadImage(file) {
        const {folder, isFile, prefix} = this.props;
        const fnUpload = isFile ? uploadFile : uploadImage;
        const args = {
            folder,
            image: file,
        };
        if (prefix) {
            args.name = `${prefix}-${file.name}`;
        }
        const res = await fnUpload(args);
        if (res) {
            this.setState({link: _.get(res, ['url'])})
        }
    }

    render() {
        const {label} = this.props;
        const {link, hasCopy, hasOpen} = this.state;
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="v-input">
                        <div className="v-input-control v-input-image">
                            <div className="v-input-slot">
                                <Dropzone onDrop={(files) => this.onDrop(files)}>
                                    {({getRootProps, getInputProps}) => (
                                        <div {...getRootProps({className: 'dropzone dropzone-custom-1'})}>
                                            <input {...getInputProps()} />
                                            {link && (
                                                <img alt={label} src={link}/>
                                            )}
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div>
                        <i className="fa fa-copy cursor-pointer fs22" onClick={this.onCopy}/>
                        {hasCopy ? (
                            <p>
                                Copied
                            </p>
                        ) : (
                            <p>
                                Click to copy link
                            </p>
                        )}
                    </div>
                    <div>
                        <i className="fa fa-external-link-square cursor-pointer fs22"
                           onClick={this.onOpen}/>
                        {hasOpen ? (
                            <p>
                                Opened
                            </p>
                        ) : (
                            <p>
                                Open
                            </p>
                        )}
                    </div>
                </div>
            </div>

        );
    }
}

DropzoneIMG.defaultProps = {
    folder: 'default',
    isWarning: false,
};

DropzoneIMG.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    showLabelRequired: PropTypes.bool,
    isWarning: PropTypes.bool,
    folder: PropTypes.string,
    isFile: PropTypes.bool,
};

export default DropzoneIMG;

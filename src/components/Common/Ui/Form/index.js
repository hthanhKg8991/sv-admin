import React from "react";
import {Formik} from 'formik';
import PropTypes from "prop-types";
import MyForm from "components/Common/Ui/Form/MyForm";

class FormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            initialValues,
            fieldWarnings,
            enableReinitialize,
            onSubmit,
            FormComponent,
            validationSchema,
            children,
            autoSubmit,
            isEdit,
            fnCallBack,
            debounceTime = 500,
        } = this.props;

        return (
            <Formik
                initialValues={initialValues}
                enableReinitialize={enableReinitialize}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    onSubmit(values, actions);
                }}>
                {({
                      values,
                      touched,
                      errors,
                      handleChange,
                      handleBlur,
                      setFieldValue,
                      handleSubmit,
                      setFieldError,
                  }) => (
                    <MyForm values={values} errors={errors} handleSubmit={handleSubmit} autoSubmit={autoSubmit} debounceTime={debounceTime}>
                        <FormComponent values={values}
                                       fieldWarnings={fieldWarnings}
                                       touched={touched}
                                       isEdit={isEdit}
                                       errors={errors}
                                       setFieldValue={setFieldValue}
                                       handleChange={handleChange}
                                       fnCallBack={fnCallBack}
                                       setFieldError={setFieldError}
                                       handleBlur={handleBlur}/>
                        {children}
                    </MyForm>
                )}
            </Formik>
        )
    }
}

FormBase.defaultProps = {
    enableReinitialize: true,
    autoSubmit: false,
    isEdit: false,
};

FormBase.propTypes = {
    initialValues: PropTypes.object.isRequired,
    validationSchema: PropTypes.object,
    fieldWarnings: PropTypes.array,
    onSubmit: PropTypes.func,
    enableReinitialize: PropTypes.bool,
    isEdit: PropTypes.bool,
    autoSubmit: PropTypes.bool,
    fnCallBack: PropTypes.func,
};

export default FormBase;

import React from 'react';
import { Formik, Form, Field } from 'formik';

import CustomInputComponent from '../../shared/custom-input-component';

import './create-session.css';

function CreateSession(props) {


    const validateForm = values => {
        {
            let errors = {};
            
            if (!values.name) {
                errors.name = 'Required';
            }

            if (!values.presenter) {
                errors.presenter = 'Required';
            }
            if (!values.duration) {
                errors.duration = 'Required';
            }
            if (!values.level) {
                errors.level = 'Required';
            }
            if (!values.abstract) {
                errors.abstract = 'Required';
            } else if (values.abstract.length > 400) {
                errors.abstract = 'Cannot exceed 400 characters'
            }

            return errors;
        }
    };

    const submitHandler = (values, actions) => {
        props.addSessionHandler(values);
        actions.setSubmitting(false);    
    };

    return (
        <>
            <div className="col-md-12">
                <h3>Create Session</h3>
            </div>
            <div className="col-md-6">
                <Formik
                    initialValues={{ name: '', presenter: '', duration: '', level:'', abstract:'' }}
                    validate={ (values) => validateForm(values) }
                    onSubmit={submitHandler}
                >
                    {({ isSubmitting, dirty, values }) => (
                        <Form>
                            <Field  component={CustomInputComponent}
                                className="form-group"
                                type="text"
                                name="name"
                                label="Session Name:"
                                placeholder="session name..." />
                            
                            <Field  component={CustomInputComponent}
                                className="form-group"
                                type="text"
                                name="presenter"
                                label="Presenter:"
                                placeholder="presenter..." /> 

                            <Field  component={CustomInputComponent}
                                className="form-group"
                                type="select"
                                name="duration"
                                label="Duration:">

                                <option value="">select duration...</option>
                                <option value="1">Half Hour</option>
                                <option value="2">1 Hour</option>
                                <option value="3">Half Day</option>
                                <option value="4">Full Day</option>
                            </Field>  

                            <Field  component={CustomInputComponent}
                                className="form-group"
                                type="select"
                                name="level"
                                label="Level:"> 

                                    <option value="">select level...</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                            </Field> 

                            <Field  component={CustomInputComponent}
                                className="form-group"
                                type="textarea"
                                name="abstract"
                                rows={3}
                                label="Abstract:"
                                placeholder="abstract..." /> 

                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" onClick={props.cancelHandler} className="btn btn-default">Cancel</button>
                        </Form>
                    )}
                </Formik>

            </div>
        </>
    );
}

export default CreateSession;

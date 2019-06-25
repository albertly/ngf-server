import React, { useContext, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';

import { EventsContext, saveEventAction } from '../../shared/contex-events';
import CustomInputComponent from '../../shared/custom-input-component';

import './create-event.css';



function CreateEvent({ history }) {

    const { state, dispatch } = useContext(EventsContext);

    const [isDirty, setDirty] = useState(true);

    const cancelHandler = () => history.push('/events');

    const submitHandler = (values, actions) => {

        saveEventAction(dispatch, values);
        
        actions.setSubmitting(false);
        setDirty(false);
        history.push('/events');

    };

    const noExit = (dirty) => {
        if (!isDirty)
            return false;
        return dirty;
    };

    const validateForm = values => {
        {
            let errors = {};
    
            if (!values.name) {
                errors.name = 'Required';
            }
            if (!values.date) {
                errors.date = 'Required';
            }
            if (!values.time) {
                errors.time = 'Required';
            }
            if (!values.price) {
                errors.price = 'Required';
            }
            if (!values.imageUrl) {
                errors.imageUrl = 'Required';
            } else if (!/[\/.](jpg|png)$/i.test(values.imageUrl)) {
                errors.imageUrl = 'Must be a png or jpg url';
            }

            return errors;
        }
    };

    return (
    <>

        <h1>New Event</h1>
        <hr/>
        <div className="col-md-6">

            <Formik
                initialValues={{ name: '', date: '', time:'', price:0,
                                 location: {address:'', city:'', country:''}, onlineUrl:'', imageUrl: '' }}
                validate={ (values) => validateForm(values) }
                onSubmit={submitHandler}
                handleChange
            >
                {({ isSubmitting, dirty, values }) => (
                <>    
                {noExit(dirty) &&
                    <Prompt message="You have not saved this event, do you really want to cancel?" />   
                }
                <Form>
                    <Field  component={CustomInputComponent}
                            className="form-group"
                            type="text"
                            name="name"
                            label="Event Name:"
                            placeholder="Name of your event..." />

                    <Field  component={CustomInputComponent}
                        className="form-group"
                        type="text"
                        name="date"
                        label="Event Date:"
                        placeholder="format (mm/dd/yyyy)..." />

                    <Field  component={CustomInputComponent}
                        className="form-group"
                        type="text"
                        name="time"
                        label="Event Time:"
                        placeholder="start and end time..." />

                    <Field  component={CustomInputComponent}
                        className="form-group"
                        type="number"
                        name="price"
                        label="Event Price:"
                        placeholder="event price..." />

                    <div>
                        <Field  component={CustomInputComponent}
                            className="form-group"
                            type="text"
                            name="location.address"
                            label="Event Location:"
                            placeholder="Address of event..." />                        
                            <div className="row">
                                <Field  component={CustomInputComponent}
                                    className="col-md-6"
                                    type="text"
                                    name="location.city"
                                    placeholder="City..." />            
                                <Field  component={CustomInputComponent}
                                    className="col-md-6"
                                    type="text"
                                    name="location.country"
                                    placeholder="Country..." />                                                     
                            </div>                    
                    </div>
                    <Field  component={CustomInputComponent}
                        className="form-group"
                        type="text"
                        name="onlineUrl"
                        label="Online Url:"
                        placeholder="Online Url..." /> 
        
                    <Field  component={CustomInputComponent}
                        className="form-group"
                        type="text"
                        name="imageUrl"
                        label="Image:"
                        placeholder="url of image...">
                        <img src={values.imageUrl} alt="" />
                    </Field>
       
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button type="button" className="btn btn-default" onClick={cancelHandler}>Cancel</button>                 
                </Form>
                </>
            )}
            </Formik>
        </div>    
    </>   
    );
}

export default CreateEvent;
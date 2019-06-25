import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css'

import { AuthContext, updateUserAction } from '../shared/context-auth';
import CustomInputComponent from '../shared/custom-input-component';

function Profile({ history }) {

  const { state, dispatch } = useContext(AuthContext);

  const cancelHandler = () => history.push('/events');

  const submitHandler = (values, actions) => {
    
    updateUserAction(dispatch, state.id, values.firstName, values.lastName);
    actions.setSubmitting(false);
    toastr.success('Profile Saved');
    history.push('/events');

  };

  const validateForm = values => {
    let errors = {};

    if (!values.firstName) {
        errors.firstName = 'Required';
    }
    if (!values.lastName) {
        errors.lastName = 'Required';
    }
    return errors;   
  };

  return (
    <div>
       <h1>Edit Your Profile</h1>
       <hr/>
       <div className="col-md-4">

       <Formik  initialValues={{ firstName: state.firstName, lastName: state.lastName }}        
                validate={ (values) => validateForm(values) }
                onSubmit={ submitHandler }
                handleChange
        >
          {() => (
            <>    
              <Form>
                  <Field  component={CustomInputComponent}
                          className="form-group"
                          type="text"
                          name="firstName"
                          lable="First Name:"
                          placeholder="First Name..." />

                  <Field  component={CustomInputComponent}
                          className="form-group"
                          type="text"
                          name="lastName"
                          lable="Last Name:"
                          placeholder="Last Name..." />
      
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-default" onClick={cancelHandler}>Cancel</button>                 
              </Form>
            </>
          )}
        </Formik>
      </div>     
    </div>   
    );
}

export default Profile;

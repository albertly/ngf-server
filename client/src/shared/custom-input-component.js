import React from 'react';

const CustomInputComponent = ({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors, isValid, values, dirty }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
  }) => {
    //console.log('Field ',  field);
    // console.log('touched ', touched);
    // console.log('errors ', errors);
    // console.log('values ', values);
    // console.log('isValid ', isValid);
    // console.log('dirty ', dirty);
    // console.log('props ', props);
    
    const propsForInput = Object.assign({}, props, field);
    delete propsForInput.className;
    delete propsForInput.children;
    delete propsForInput.label;
    
    return (
        <div className={props.className}>
        { props.label &&
            <label htmlFor={field.name}>{ props.label }</label>
        }
        { errors[field.name] && touched[field.name] &&
            <em>{ errors[field.name] }</em> }

        { props.type !== 'select' && props.type !== 'textarea' ? (
            <>
                <input className="form-control" { ...propsForInput } />
                { props.children }
            </>
            ) :
            (
                <props.type className="form-control" { ...propsForInput }>
                    { props.children }
                </props.type>
            )
        }
        
        </div>
    )
  };

  export default CustomInputComponent;
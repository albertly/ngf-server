import React, { useState, useContext, useEffect }  from 'react';

import { AuthContext, AuthUserAction } from '../shared/context-auth';

import './login.css';

function Login({ history }) {

    const [userName, setUserName] = useState('bradgreen');
    const [userNameValid, setUserNameValid] = useState(true);
    const [userNameTouched, setUserNameTouched] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const { state, dispatch } = useContext(AuthContext);
    
    useEffect(() => {
        if (state.isAuthenticated()) {
            history.push('/events');
        }
    }, [state]);


    const handleSubmit = (event) => {
        event.preventDefault();

        AuthUserAction(dispatch, userName, password).then( () => {
            console.log("In then", state.userName);
        });
        
    };

    return (
    <>
        <h1>Login</h1>
        <hr/>
        <div className="col-md-4">
            <form   autoComplete="off" noValidate onSubmit={handleSubmit}>
                <div className="form-group" >
                    <label htmlFor="userName">User Name:</label>
                    { !userNameValid && <em>Required</em> }
                    <input  name="userName"
                            value={userName}
                            onChange={(event) => {
                                setUserName(event.target.value);
                                setUserNameValid(!!event.target.value);
                                }
                            }
                            onBlur={() => !userNameTouched ? setUserNameTouched(true) : null} 
                            required
                            id="userName"
                            type="text"
                            className="form-control"
                            placeholder="User Name..." />
                </div>
                <div className="form-group" >
                    <label htmlFor="password">Password:</label>
                    { !passwordValid && <em>Required</em> }
                    <input  name="password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setPasswordValid(!!event.target.value);
                                }
                            }
                            onBlur={() => !passwordTouched ? setPasswordTouched(true) : null}
                            required
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Password..." />
                </div>
                { state.errorMessage && <div className="alert alert-danger">{state.errorMessage}</div> }            
                <span onMouseEnter={()=>{}} onMouseLeave={()=>{}}>
                    <button type="submit"  className="btn btn-primary">Login</button>
                </span>
                <button type="button" onClick={()=>history.push('/events')} className="btn btn-default">Cancel</button>
            </form>
        </div>
    </>   
    );
}

export default Login;

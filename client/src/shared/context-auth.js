import React, {useReducer} from 'react';
import axios from 'axios';

const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_FAILURE = 'AUTH_FAILURE';
const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

const AuthContext = React.createContext();

const initialState = {
    id: 0,
    userName: '',
    firstName: '',
    lastName: '',
    errorMessage: '',
    isAuthenticated(){return !!this.userName}
}

const reducer = (state, action) => {
    switch (action.type) {
        case AUTH_SUCCESS:
            return { ...state,
                     ...action.payload,
                     errorMessage: ''
                    }
        case UPDATE_USER_FAILURE:
        case AUTH_FAILURE:
            console.log('In dispatch failure ', action.error);
            return { ...state,
                     errorMessage: action.error
                   }    
        case UPDATE_USER_SUCCESS:
            return { ...state,
                     firstName: action.firstName,
                     lastName: action.lastName,
                   }        
        default:
            return state;
    }
};

const authUser =  (userName, password) => {
    return  axios.post('/api/login', { username: userName, password: password });

    // return new Promise((resolve, reject) => {
    //   if (userName === "user1" && password === "pass") {
    //     setTimeout(() => resolve(userName), 1000);  
    //   } else {
    //     setTimeout(() => reject("Auth error"), 1000);
    //   }
    // });
};

const updateUser =  (userId, firstName, lastName) => {
    return  axios.put(`/api/users/${userId}`, { id: userId, firstName: firstName, lastName: lastName });
};

const  AuthUserAction = async (dispatch, userName, password) => {
    let response = {};
    try {
        response = await authUser(userName, password);
        await dispatch({ type:AUTH_SUCCESS, payload: response.data.user });
    }
    catch(ex) {
        dispatch({ type: AUTH_FAILURE, error: 'Auth Error' })
    }
}

const  updateUserAction = async (dispatch, userId, firstName, lastName) => {
    let response = {};
    try {
        response = await updateUser(userId, firstName, lastName);
        await dispatch({ type:UPDATE_USER_SUCCESS, firstName: response.data.firstName, lastName: response.data.lastName });
    }
    catch(ex) {
        dispatch({ type: UPDATE_USER_FAILURE, error: 'Update User Error' })
    }
}

function ContextAuthProvider(props) {
    let [state, dispatch] = useReducer(reducer, initialState);
    let value = { state, dispatch };
    
    return (
      <AuthContext.Provider value={value}>{ props.children }</AuthContext.Provider>
    );
  }

  const AuthContextConsumer = AuthContext.Consumer;

  export { AuthContext, ContextAuthProvider, AuthContextConsumer, AuthUserAction, updateUserAction };
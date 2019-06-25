import React, { useReducer } from 'react';
import axios from 'axios';

const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';

const GET_EVENT_SUCCESS = 'GET_EVENT_SUCCESS';
const GET_EVENT_FAILURE = 'GET_EVENT_FAILURE';

const SAVE_EVENT_SUCCESS = 'SAVE_EVENT_SUCCESS"';
const SAVE_EVENT_FAILURE = 'SAVE_EVENT_FAILURE';

const ADD_VOTER_SUCCESS = 'ADD_VOTER_SUCCESS';
const ADD_VOTER_FAILURE = 'ADD_VOTER_FAILURE';

const DELETE_VOTER_SUCCESS = 'ADD_VOTER_SUCCESS';
const DELETE_VOTER_FAILURE = 'ADD_VOTER_FAILURE';

const ADD_SESSION_FAILURE = 'ADD_SESSION_FAILURE';

const EventsContext = React.createContext();


const initialState = { events:[], currentEvent:{}, errorMessage:'' };

const reducer = (state, action) => {

    switch (action.type) {
        case GET_EVENTS_SUCCESS:
            return { ...state, events: action.payload, errorMessage: '' };

        case SAVE_EVENT_SUCCESS:
            return { ...state, events: state.events.concat(action.payload), errorMessage: '' }

        case GET_EVENT_SUCCESS:
            return  { ...state, currentEvent: action.payload, errorMessage: '' };

        case DELETE_VOTER_SUCCESS:
        case ADD_VOTER_SUCCESS:
            let newEvent;
            const newEvents = state.events.map(event => {
                if (event.id === action.eventId) {
                     newEvent = { ...event, sessions: event.sessions.map(session => {
                        if (session.id === action.sessionId) {
                            return action.session;
                        } else {
                            return session;
                        }
                    })
                  }
                  return newEvent;
                } else {
                    return event;
                }
            })

            return { ...state, events: newEvents, currentEvent: newEvent, errorMessage: '' };

        case ADD_SESSION_FAILURE:
        case ADD_VOTER_FAILURE:
        case DELETE_VOTER_FAILURE:
        case GET_EVENT_FAILURE:
        case SAVE_EVENT_FAILURE:
        case GET_EVENTS_FAILURE:
             return { ...state, currentEvent:{}, errorMessage: action.error }

        default:
            return state;
    }
};

const voteAction = async (dispatch, eventId, sessionId, voterId, action) => {
    let response = {};
    const url = `/api/events/${eventId}/sessions/${sessionId}/voters/${voterId}`;
    //console.log('In voteAction');
    try {
        if (action === 'add') {
            response = await axios.post(url);
            dispatch({ type: ADD_VOTER_SUCCESS, eventId, sessionId, session: response.data });
        } else {
            response = await axios.delete(url);
           // console.log('ADD_VOTER_SUCCESS', response);
            dispatch({ type: DELETE_VOTER_SUCCESS, eventId, sessionId, session: response.data });
        }
    }
    catch(ex) {
        if (action === 'add') {
            dispatch({ type: ADD_VOTER_FAILURE, error: 'Add Vote Error' });
        } else {
            console.log('Error in dispatch', ex);
            dispatch({ type: DELETE_VOTER_FAILURE, error: 'Delete Vote Error' });
        }
    }
}
//ToDo: currentEvent use Id only
//ToDo: give correct error message
const addSessionAction = async (dispatch, event, session) => {
    const nextId = Math.max.apply(null, event.sessions.map(s => s.id));
    session.id = nextId + 1;
    session.voters = [];
    event.sessions.push(session);
    await saveEventAction(dispatch, event);
}



const searchSessionsAction = async (search) => {
    let response = {};
    try {
        response = await axios.get(`/api/sessions/search?search=${search}`);
        return response.data;
    }
    catch(ex) {
        return {};
    }
}

const getEventAction = async (dispatch, eventId) => {
    let response = {};
    try {
        response = await axios.get(`/api/events/${eventId}`);
        dispatch({ type: GET_EVENT_SUCCESS, payload: response.data });
    }
    catch(ex) {
        console.log('error', ex);
        return await dispatch({ type: GET_EVENT_FAILURE, error: 'Get Event Error' });
    }
}

const saveEventAction = async (dispatch, event) => {
    let response = {};
    try {
        response = await axios.post('/api/events', event);
        dispatch({ type: SAVE_EVENT_SUCCESS, payload: response.data });
    }
    catch(ex) {
        dispatch({ type: SAVE_EVENT_FAILURE, error: 'Save Event Error' });
    }
}

const getEventsAction = async (dispatch) => {
    let response = {};
    try {
        response = await axios.get('/api/events');
        dispatch({ type: GET_EVENTS_SUCCESS, payload: response.data });
    }
    catch(ex) {
        dispatch({ type: GET_EVENTS_FAILURE, error: 'Get Events Error' });
    }
}

function ContextEventsProvider(props) {
    let [state, dispatch] = useReducer(reducer, initialState);
    let value = { state, dispatch };
    
    return (
      <EventsContext.Provider value={value}>{props.children}</EventsContext.Provider>
    );
}


export { 
        EventsContext,
        ContextEventsProvider,
        getEventsAction,
        saveEventAction,
        getEventAction,
        voteAction,
        addSessionAction,
        searchSessionsAction
       };
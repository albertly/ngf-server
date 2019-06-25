import React, { useContext, useState, useEffect } from 'react';

import { CreateSession, SessionsList } from  '..';
import { EventsContext, getEventAction, addSessionAction } from '../../shared/contex-events';

import styles from './event-details.module.css';

function useForceUpdate(){
    const [value, set] = useState(true); //boolean state
    return () => set(!value); // toggle the state to force render
}

function EventDetails({match, history}) {
 
    let event= {};
    const [addMode, setAddMode] = useState(false);

    const [filterBy, setFilterBy] = useState('All');
    const [sortBy, setSortBy] = useState('votes');

    const { state, dispatch } = useContext(EventsContext);

    useEffect(() => {
        getEventAction(dispatch, match.params.id);
    }, [match.params.id]);

    const forceUpdate = useForceUpdate();

    const saveNewSession = session => {
        addSessionAction(dispatch, event, session);
        setAddMode(false);
    };

    const resort = () => {
        if (sortBy === 'votes') {
         //   set(!value);
            forceUpdate();
        }
    }

    event = state.currentEvent;

    if (!state.currentEvent) {
        history.push('/error');
    }

    return (
        <div className={ [styles.container, 'container'].join(' ')}>
            <img src={event.imageUrl} alt={event.name} className={styles['event-image']}/> 

            <div className="row">
                <div className="col-md-11">
                <h2>{ !event.name || event.name.toUpperCase() } </h2>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div><strong>Date:</strong> {event.date}</div>
                    <div><strong>Time:</strong> {event.time}</div>
                    <div><strong>Price:</strong> $ {event.price}</div>
                </div>
                {event.location && 
                <div className="col-md-6">
                    <address>
                        <strong>Address:</strong><br/>
                        {event.location.address}<br/>
                        {event.location.city}, {event.location.country}
                    </address>
                </div>
                }
            </div>

            <hr/>
            <div className="row" style={{marginBottom :'10px'}}>
                <div className="col-md-2">
                    <h3 style={{margin:0}}>Sessions</h3>
                </div>

                <div className="col-md-7">
                    <div className="btn-group btn-group-sm" style={{marginRight:'20px', marginLeft:'20px'}}>
                        <button className={'btn btn-default '.concat((sortBy === 'name') ? 'active': '')}
                                onClick={()=>setSortBy('name')}>By Name</button>
                        <button className={'btn btn-default '.concat((sortBy === 'votes') ? 'active': '')} 
                                onClick={()=>setSortBy('votes')}>By Votes</button>
                    </div>

                    <div className="btn-group btn-group-sm">
                        <button className={'btn btn-default '.concat((filterBy === 'All') ? 'active': '')}
                                onClick={()=>setFilterBy('All')}>All</button>
                        <button className={'btn btn-default '.concat((filterBy === 'Beginner') ? 'active': '')}
                                onClick={()=>setFilterBy('Beginner')}>Beginner</button>
                        <button className={'btn btn-default '.concat((filterBy === 'Intermediate') ? 'active': '')}
                                onClick={()=>setFilterBy('Intermediate')}>Intermediate</button>
                        <button className={'btn btn-default '.concat((filterBy === 'Advanced') ? 'active': '')}
                                onClick={()=>setFilterBy('Advanced')}>Advanced</button>
                    </div>
                </div>

                <div className="col-md-2">
                    <a onClick={()=>{setAddMode(true)}}>Add Session</a>
                </div>
            </div>
           
            { event.sessions && !addMode &&
                <SessionsList sessions={event.sessions}
                              filterBy={filterBy}
                              sortBy={sortBy}
                              eventId={event.id}
                              resort={resort} 
                />
            }
            
            { addMode &&
                <CreateSession cancelHandler={()=>setAddMode(false)}
                               addSessionHandler={session => saveNewSession(session)}
                />
            }

        </div>
    );
}

export default EventDetails;

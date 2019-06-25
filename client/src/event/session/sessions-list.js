import React from 'react';

import { Session } from  '..';

function SessionsList(props) {

    return (
        <div className="row" >
            { props.sessions.filter(session =>  props.filterBy === 'All' ? true :  session.level === props.filterBy)
                       .sort( (a, b) => props.sortBy === 'votes' ? (a.voters.length > b.voters.length) ? 1 : -1
                                                           : (a.name > b.name) ? 1 : -1)
                       .map(session => <Session key={session.id} eventId={props.eventId} session={session}  resort={props.resort}/>
            )}
        </div>
    );

}

export default SessionsList;
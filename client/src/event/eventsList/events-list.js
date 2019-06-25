import React, { useContext, useEffect } from 'react';

import { EventsContext, getEventsAction } from '../../shared/contex-events';
import { EventThumbnail } from '..';

function EventsList(props) {

  const { state, dispatch } = useContext(EventsContext);

  useEffect(() => {
    getEventsAction(dispatch);
  }, []);

  const handleThumbnailClick = eventId => props.history.push(`/events/${eventId}`);
  return (
    <div>
    <h1>Upcoming Angular Events</h1>
    <hr/>
      <div className="row">
        {state.events.map(e => <div key={e.id} className="col-md-5"><EventThumbnail onClickHandler={handleThumbnailClick}  event={e}></EventThumbnail></div>)}
      </div>
    </div>
  );
}
  

export default EventsList;
import React from 'react'

import styles from './event-thumbnail.module.css';

const EventThumbnail = props => {
    let place =  '';
    let startTime = '';

    const getStartTimeStyle = () => {
      if (props.event.time === '8:00 am')
        return {color: '#003300', 'fontWeight': 'bold'}
      return {}
    }

    switch(props.event.time) {
      case '8:00 am': startTime = ' (Early Start)'; break;
      case '10:00 am': startTime = ' (Late Start)'; break;
      default : startTime = ' (Normal Start)';
    }

    if (!props.event.location) {
      place =  <div>
                 Online URL: {props.event.onlineUrl}
                </div>;
    }
    else {
      place =  <div>
                  <span>Location: {props.event.location.address}</span>
                  <span className={styles['pad-left']}>{props.event.location.city}, {props.event.location.country}</span>
                </div>;   
    }

    // className={[styles.well, 'hoverwell', styles.thumbnail].join(' ')}
    // className="well hoverwell thumbnail"
    return (
      <div onClick={() => props.onClickHandler(props.event.id)} className={['well', styles.well, 'hoverwell', styles.thumbnail].join(' ')}>
        <h2>{props.event.name.toUpperCase()}</h2>
        <div>Date: {props.event.date}</div>
        <div style={getStartTimeStyle()}>Time: {props.event.time}
          <span>{startTime}</span>
        </div>
        <div>Price: ${props.event.price}</div>
        {place}
      </div>
    );
  }
  
  export default EventThumbnail;
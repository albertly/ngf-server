import React from 'react';

import styles from './upvote.module.css';

function Upvote({ count, voted, toggleVoter }) {
    let iconColor = voted ? 'red' : 'white';
    return (
            <div className={ [styles.votingWidgetContainer, 'pointable'].join(' ') } onClick={toggleVoter}>
                <div className={ ['well', styles.votingWidget].join(' ') }>
                    <div className={ styles.votingButton }>
                        <i className="glyphicon glyphicon-heart" style={{color: iconColor}}></i>
                    </div>
                    <div className={ ['badge',  'badge-inverse', styles.votingCount].join(' ') }>
                        <div>{count}</div>
                    </div>
                </div>
            </div>
    )
}

export default Upvote;
import React, { useContext } from 'react';

import { AuthContext } from '../../shared/context-auth';
import { EventsContext, voteAction } from '../../shared/contex-events';
import Upvote from './upvote';
import CollapsibleWell from '../../shared/collapsible-well'


function Session({ eventId, session, resort }) {
    const { state, } = useContext(AuthContext);
    const { _, dispatch } = useContext(EventsContext);

    const userHasVoted = (session, voterName) => {
        return session.voters.some(voter => voter === voterName);
    }

    const toggleVoter = () => {
        const userName = state.userName;
        let action = 'add';
        if(userHasVoted(session, userName )) {
          action = 'delete';         
        }

        voteAction(dispatch, eventId, session.id, userName, action).then(() => {
            resort();
        })

        // if(this.sortBy === 'votes') {
        //   this.visibleSessions.sort(sortByVotesDesc);
        // }
    }

    return (
        <div className="row" >
            <div className="col-md-1">
                { state.isAuthenticated() && (
                    <div>
                        <Upvote count={session.voters.length}
                                voted={userHasVoted(session, state.userName )}
                                toggleVoter={toggleVoter}>
                        </Upvote>
                    </div>
                )}
            </div>
            <div className="col-md-10">
                <CollapsibleWell title={session.name} showFire={session.voters.length > 2}>
                    <div>
                        <h6>{session.presenter}</h6>
                        <span>Duration: {session.duration}</span><br />
                        <span>Level: {session.level}</span>
                        <p>{session.abstract}</p>
                    </div>
                </CollapsibleWell>
            </div>
        </div>
    );
}

export default Session;
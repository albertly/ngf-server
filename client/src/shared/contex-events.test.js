import React, { useContext, useState, useEffect } from 'react';
import Enzyme, { mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import TestRenderer from "react-test-renderer";


import { ContextEventsProvider, EventsContext, voteAction, getEventsAction } from './contex-events';


Enzyme.configure({ adapter: new Adapter() });



describe('VoterService', () => {
    describe('deleteVoter', () => {

        test('should remove the voter from the list of voters', async () => {

            
            axios.defaults.baseURL = 'http://localhost:8808';
            
            let outerState = {};
            let outerDispatch = {};

            function ContexHelper() {
                const { state, dispatch } = useContext(EventsContext);
     

                outerState = state;
                outerDispatch = dispatch;

                useEffect(() => {
                    getEventsAction(dispatch).then(() => voteAction(dispatch, 1, 1, 'bradgreen', 'delete').then(() => {}))
                },[]);

 //             console.log('state', state);
                return  (
                    <div>
                        {state.events[0] &&  state.events[0].sessions[0].voters.length}
                    </div>
                )
            }

            const p = new Promise((resolve, reject) => {
                const wrapper =  mount( <ContextEventsProvider><ContexHelper></ContexHelper></ContextEventsProvider> 
                    );
                setTimeout(() => resolve(wrapper), 1000); 
            });

            await p.then((wrapper) => console.log(wrapper.update().debug()))
            

        })
    })
})
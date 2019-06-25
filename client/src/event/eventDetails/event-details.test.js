import React from 'react';
import Enzyme, { mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import TestRenderer from "react-test-renderer";


import EventDetails from './event-details';
import { ContextEventsProvider } from '../../shared/contex-events';
import { ContextAuthProvider } from '../../shared/context-auth';
import { getEvent } from '../../shared/events';

const act = TestRenderer.act;
Enzyme.configure({ adapter: new Adapter() });

describe('EventDetails',  () => {
    xit('should filter the session correctly', async () => {
        
        const mockData = getEvent(1);

        const mock = new MockAdapter(axios);
        mock.onPost('/api/events/1').reply(200, mockData);                   
                                        
        const match = { params: { id: '1' } }
        const history = [];

        //let component;
        // act(() => {
        //   component = TestRenderer.create(<ContextEventsProvider>
        //                              <ContextAuthProvider> 
        //                                <EventDetails match={match} history={history} />
        //                              </ContextAuthProvider> 
        //                              </ContextEventsProvider> );
        // });


        //   act(() => {
        //     console.log(component.root.findByType(EventDetails));
        //   });

        const p = new Promise((resolve, reject) => {
            const wrapper =  mount( <ContextEventsProvider>
                <ContextAuthProvider> 
                  <EventDetails match={match} history={history} />
                </ContextAuthProvider> 
                </ContextEventsProvider> 
                );
            setTimeout(() => resolve(wrapper), 0); 
        });

       // await p.then((wrapper) => console.log(wrapper.update().debug()))

        // const wrapper =  mount( <ContextEventsProvider>
        //     <ContextAuthProvider> 
        //       <EventDetails match={match} history={history} />
        //     </ContextAuthProvider> 
        //     </ContextEventsProvider> 
        //     );
        // console.log(wrapper.update().debug());

    })
    
});
import React from 'react';
import Enzyme, { mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SessionsList from './sessions-list';
import Session from './session';
import { ContextAuthProvider } from '../../shared/context-auth';
import { ContextEventsProvider } from '../../shared/contex-events';

Enzyme.configure({ adapter: new Adapter() });

describe('SessionsList',  () => {
    it('should filter the session correctly', () => {
        const sessions = [{name: 'session 1', level: 'intermediate'},
                        {name: 'session 2', level: 'intermediate'},
                        {name: 'session 3', level: 'beginner'}];
        const filterBy = 'All';
        const sortBy = 'name';
        const eventId = 3;

        // const wrapper =  shallow(<ContextAuthProvider><SessionsList  sessions={sessions}
        //                                         filterBy={filterBy}
        //                                         sortBy={sortBy}
        //                                         eventId={eventId}
        //                                         resort={()=>{}} 
        //                             />
        //                             </ContextAuthProvider>
        //                             );
        const wrapper =  shallow(<SessionsList  sessions={sessions}
                                        filterBy={filterBy}
                                        sortBy={sortBy}
                                        eventId={eventId}
                                        resort={()=>{}} 
                            />
                            );
      // console.log(wrapper.find(Session).length);
       //console.log(wrapper.find('div.row').children().at(1).html())
        expect(wrapper.find('div.row').children().length).toEqual(3);
    })


    it('should sort the session correctly', () => {
        const sessions = [{name: 'session 1', level: 'intermediate', voters:[], presenter:'', duration:0},
                        {name: 'session 3', level: 'intermediate', voters:[], presenter:'', duration:0},
                        {name: 'session 2', level: 'beginner', voters:[], presenter:'', duration:0}];
        const filterBy = 'All';
        const sortBy = 'name';
        const eventId = 3;

        const wrapper =  mount(<ContextAuthProvider>
                                <ContextEventsProvider>
                                    <SessionsList  sessions={sessions}
                                                filterBy={filterBy}
                                                sortBy={sortBy}
                                                eventId={eventId}
                                                resort={()=>{}} 
                                    />
                                </ContextEventsProvider>
                                </ContextAuthProvider>
                                );

     //  console.log(wrapper.html());
       console.log(wrapper.find('h4 div').at(2).text()); //children().at(1).html())
       expect(wrapper.find('h4 div').at(2).text()).toEqual('session 3');
    })
})
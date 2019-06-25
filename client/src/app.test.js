import React from 'react';
import Enzyme, { mount, render } from 'enzyme';
import { MemoryRouter } from 'react-router';

import Error404 from './errors/error404';
import EventDetails from './event/eventDetails/event-details';
import EventsList from './event/eventsList/events-list';
import App from './app';

import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(
    <MemoryRouter><App /></MemoryRouter>
  );
 // ReactDOM.unmountComponentAtNode(div);
});

it('invalid path should redirect to 404', () => {
   const wrapper = mount(
     <MemoryRouter initialEntries={[ '/random' ]}>
       <App/>
     </MemoryRouter>
   );
   expect(wrapper.find(EventDetails)).toHaveLength(0);
   expect(wrapper.find(Error404)).toHaveLength(1);
 });

 test('valid path should not redirect to 404', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={[ '/events' ]}>
      <App/>
    </MemoryRouter>
  );
  expect(wrapper.find(EventsList)).toHaveLength(1);
  expect(wrapper.find(Error404)).toHaveLength(0);
});
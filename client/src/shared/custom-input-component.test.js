import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CustomInputComponent from './custom-input-component';

Enzyme.configure({ adapter: new Adapter() });

describe('CustomInputComponent', () => {

    it('renders <CustomInputComponent /> component as input', () => {

        const field = {name: 'name', value:'Albert', onChange: ()=>{}};
        const form = {touched: {'name': false}, errors: {}};
        const props = {label: 'My Name ...', type: 'input', className: 'my-class'};

        const wrapper = shallow(<CustomInputComponent field={field} form={form} { ...props }/>);
        
        console.log(wrapper.html())
        const control = wrapper.find(props.type);
        
        expect(control.length).toEqual(1);

        const label = wrapper.find('label');
        expect(label.length).toEqual(1)
        expect(label.text()).toEqual('My Name ...');

        expect(wrapper.find('input.form-control').length).toEqual(1);

      });

      it('renders <CustomInputComponent /> component as textarea', () => {

        const field = { name: 'name', value:'Albert', onChange: ()=>{} };
        const form = { touched: {'name': false}, errors: {} };
        const props = { label: 'My Name ...', type: 'textarea', className: 'my-class'};

        const wrapper = shallow(<CustomInputComponent field={field} form={form} { ...props }/>);
        
        console.log(wrapper.html())
        console.log('Text ' + wrapper.find('div.my-class').text());
        console.log('Value ' + wrapper.render().find('textarea').text());
        
        expect(wrapper.find(props.type).length).toEqual(1);
        expect(wrapper.render().find('textarea').text()).toEqual('Albert');

        const label = wrapper.find('label');
        expect(label.length).toEqual(1)
        expect(label.text()).toEqual('My Name ...');

        expect(wrapper.find('textarea.form-control').length).toEqual(1);
        expect(wrapper.find('div.my-class').length).toEqual(1);

      });
});
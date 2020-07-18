import React from 'react';

import { EuiSuperSelect} from '@elastic/eui';

const Superselect = ({value,setValue, choose}) => {

    //Options for superselect
    let options =[];
    if (choose == 1) {
    options =  [
        {
        value: 'walk',
        inputDisplay: (
                <div style={{fontSize:"1.05rem"}}><i className="fas fa-walking"></i> Walk</div>
        )},
        {
            value: 'bike',
            inputDisplay: (
                <div style={{fontSize:"1.05rem"}}><i className="fas fa-bicycle"></i> Bicycle</div>
            )},
            {
        value: 'car',
        inputDisplay: (
                <div style={{fontSize:"1.05rem"}}><i className="fas fa-car"></i> Car</div>
        )},
        
        ]
    }
    else {
        options =  [
        {
        value: '300',
        inputDisplay: (
                <div style={{fontSize:"1.05rem"}}><i className="fas fa-stopwatch"></i> 5 Min</div>
        )},
        {
            value: '600',
            inputDisplay: (
                <div style={{fontSize:"1.05rem"}}><i className="fas fa-stopwatch"></i> 10 Min</div>
            )},
            {
        value: '900',
        inputDisplay: (
            <div style={{fontSize:"1.05rem"}}><i className="fas fa-stopwatch"></i> 15 Min</div>
        )},
        {
            value: '1200',
            inputDisplay: (
                <div style={{fontSize:"1.05rem"}}><i className="fas fa-stopwatch"></i> 20 Min</div>
            )},
        {
            value: '1500',
            inputDisplay: (
                <div style={{fontSize:"1.05rem"}}><i className="fas fa-stopwatch"></i> 25 Min</div>
            )},
        {
            value: '1800',
            inputDisplay: (
                <div style={{fontSize:"1.05rem"}}><i className="fas fa-stopwatch"></i> 30 Min</div>
            )}
        ]
    }


    const onChange = value => {
        setValue(value);
      };

    return (

        <EuiSuperSelect
          options={options}
          valueOfSelected={value}
          onChange={value => onChange(value)}
          fullWidth
        />

        );
    };
    
export default Superselect;
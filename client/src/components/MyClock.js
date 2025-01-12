import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Modal } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import './MyClock.css';

function MyClock(props) {
  

  return (
    <>
      {props.value && props.clock &&
        <Card body className="clockButton m-0 p-0 text-center align-items-center">
          <DateTimePicker
            onChange={props.setValue}
            value={props.value}
            format='yyyy-MM-dd HH:mm'
            required={true}
            clearIcon={null}
            locale='en-us'
          />
        </Card>
      }
    </>
  );

}


export default MyClock;
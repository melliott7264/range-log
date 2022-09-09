import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FIREARM } from '../utils/queries';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

import AuthService from '../utils/auth';
import { EDIT_FIREARM } from '../utils/mutations';

const SingleFirearm = () => {
  const { id } = useParams();

  const loggedIn = AuthService.loggedIn();

  const [firearmData, setFirearmData] = useState({});

  const { data } = useQuery(
    GET_FIREARM,
    {
      variables: { _id: id },
    },
    { skip: !loggedIn }
  );
  const [editFirearm, { error }] = useMutation(EDIT_FIREARM);

  useEffect(() => {
    const firearm = data?.firearm[0] || {};
    setFirearmData(firearm);
  }, [data]);

  const handleEditFirearm = async (event) => {
    try {
      const response = await editFirearm({
        variables: {
          _id: id,
          name: firearmData.name,
          ignitionType: firearmData.ignitionType,
          barrelLength: firearmData.barrelLength,
          caliber: firearmData.caliber,
          measureSystem: firearmData.measureSystem,
        },
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDataChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setFirearmData({ ...firearmData, [name]: value });
  };

  return (
    <div>
      <div className="text-center">
        <h3>Firearm Description</h3>
      </div>
      <Form onSubmit={handleEditFirearm}>
        <Form.Group>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={firearmData.name || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Ignition Type:</Form.Label>
          <Form.Control
            type="text"
            name="ignitionType"
            value={firearmData.ignitionType || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Barrel Length(inches/mm):</Form.Label>
          <Form.Control
            type="number"
            name="barrelLength"
            value={firearmData.barrelLength || 0}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Caliber(inches/mm):</Form.Label>
          <Form.Control
            type="number"
            step="0.001"
            name="caliber"
            value={firearmData.caliber || 0}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Metric:</Form.Label>
          <Form.Check
            type="checkbox"
            name="measureSystem"
            checked={firearmData.measureSystem || false}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Button className="p-1" type="submit" variant="primary">
          Submit Edits
        </Button>
      </Form>
    </div>
  );
};

export default SingleFirearm;

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FIREARM } from '../utils/queries';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

import AuthService from '../utils/auth';
import { EDIT_FIREARM, REMOVE_FIREARM } from '../utils/mutations';

const SingleFirearm = () => {
  // id passed to component through URI parameters from Route in App.js
  const { id } = useParams();

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace('/');
  }

  let measureInches = '(in)';
  let measureInch = ' (.001")';

  // state controlling firearm description data
  const [firearmData, setFirearmData] = useState({});

  const { data } = useQuery(
    GET_FIREARM,
    {
      variables: { _id: id },
    },
    { skip: !loggedIn }
  );
  const [editFirearm] = useMutation(EDIT_FIREARM);

  const [deleteFirearm] = useMutation(REMOVE_FIREARM);

  useEffect(() => {
    const firearm = data?.firearm[0] || {};
    setFirearmData(firearm);
  }, [data]);

  // routine to edit the selected firearm
  const handleEditFirearm = async (event) => {
    try {
      const response = await editFirearm({
        variables: {
          _id: id,
          name: firearmData.name,
          ignitionType: firearmData.ignitionType,
          barrelLength: firearmData.barrelLength,
          caliber: firearmData.caliber,
          diaTouchHole: firearmData.diaTouchHole,
          diaRearSight: firearmData.diaRearSight,
          diaFrontSight: firearmData.diaFrontSight,
          heightFrontSight: firearmData.heightFrontSight,
          heightRearSight: firearmData.heightRearSight,
          sightRadius: firearmData.sightRadius,
          measureSystem: firearmData.measureSystem,
        },
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDataChange = (event) => {
    // handling multiple input types
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    // The following code is necessary because Form.Control type=number actually returns a string
    // parseFloat will also return an integer if an integer is typed as well as returning a float
    if (target.type === 'number') {
      value = parseFloat(value);
    }
    setFirearmData({ ...firearmData, [name]: value });
    console.log(firearmData);
  };

  // routine to delete a firearm
  const handleFirearmDelete = async () => {
    try {
      const response = await deleteFirearm({
        variables: {
          _id: id,
        },
      });
      console.log(response);
      window.location.replace('/firearms');
    } catch (err) {
      console.log(err);
    }
  };

  if (firearmData.measureSystem === true) {
    measureInches = '(mm)';
    measureInch = ' (0.01mm)';
  }

  return (
    <div>
      <div className="text-center">
        <h3>Firearm Description</h3>
      </div>
      <Form onSubmit={handleEditFirearm}>
        <Form.Group>
          <Form.Label className="m-2">Name:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="name"
            value={firearmData.name || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Ignition Type:</Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="ignitionType"
            value={firearmData.ignitionType || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Barrel Length:</Form.Label>
          <span>{measureInches}</span>
          <Form.Control
            className="w-50 float-end"
            type="number"
            step="1"
            name="barrelLength"
            value={firearmData.barrelLength || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Caliber:</Form.Label>
          <span>{measureInches}</span>
          <Form.Control
            className="w-50 float-end"
            type="number"
            step="0.001"
            name="caliber"
            value={firearmData.caliber || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Dia Touch Hole:</Form.Label>
          <span>{measureInch}</span>
          <Form.Control
            className="w-50 float-end"
            type="number"
            step="0.001"
            name="diaTouchHole"
            value={firearmData.diaTouchHole || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Dia@Rear Sight:</Form.Label>
          <span>{measureInches}</span>
          <Form.Control
            className="w-50 float-end"
            type="number"
            step="0.001"
            name="diaRearSight"
            value={firearmData.diaRearSight || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Dia@Front Sight:</Form.Label>
          <span>{measureInches}</span>
          <Form.Control
            className="w-50 float-end"
            type="number"
            step="0.001"
            name="diaFrontSight"
            value={firearmData.diaFrontSight || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Height Rear Sight:</Form.Label>
          <span>{measureInches}</span>
          <Form.Control
            className="w-50 float-end"
            type="number"
            step="0.001"
            name="heightRearSight"
            value={firearmData.heightRearSight || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Height Front Sight:</Form.Label>
          <span>{measureInches}</span>
          <Form.Control
            className="w-50 float-end"
            type="number"
            step="0.001"
            name="heightFrontSight"
            value={firearmData.heightFrontSight || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Sight Radius:</Form.Label>
          <span>{measureInches}</span>
          <Form.Control
            className="w-50 float-end"
            type="number"
            step="0.001"
            name="sightRadius"
            value={firearmData.sightRadius || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Metric:</Form.Label>
          <Form.Check
            className="m-2 p-2 float-end"
            type="checkbox"
            name="measureSystem"
            checked={firearmData.measureSystem || false}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Button className="p-1 m-2" type="submit" variant="primary">
          Submit Edits
        </Button>
        <Button
          className="p-1 m-2"
          type="button"
          variant="danger"
          onClick={handleFirearmDelete}
        >
          Delete Firearm
        </Button>
      </Form>
    </div>
  );
};

export default SingleFirearm;

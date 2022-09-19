import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_LOG_ENTRIES_BY_SHOT, GET_FIREARM } from '../utils/queries';
import {
  ADD_LOG_ENTRY,
  EDIT_LOG_ENTRY,
  REMOVE_LOG_ENTRY,
} from '../utils/mutations';
import dayjs from 'dayjs';
import AuthService from '../utils/auth';
import { Form, Button } from 'react-bootstrap';

const Shots = () => {
  const { date, target, shot, firearmId } = useParams();
  const targetNumber = parseInt(target);
  const shotNumber = parseInt(shot);

  const [showShot, setShowShot] = useState();
  const [showFirearm, setShowFirearm] = useState();

  const loggedIn = AuthService.loggedIn();

  // initialize units of measure
  let measureInches = ' (inch)';
  let measureSpeed = ' (Mph)';
  let measureTemp = ' (F)';
  let measureMass = ' (gr)';

  const { loading, error, data } = useQuery(
    GET_LOG_ENTRIES_BY_SHOT,
    { variables: { date: date, target: targetNumber, shot: shotNumber } },
    { skip: !loggedIn }
  );

  const { data: data2 } = useQuery(
    GET_FIREARM,
    { variables: { _id: firearmId } },
    { skip: !loggedIn }
  );

  const [editLogEntry] = useMutation(EDIT_LOG_ENTRY);

  const [deleteLogEntry] = useMutation(REMOVE_LOG_ENTRY);

  useEffect(() => {
    const shotData = data?.logsByShot[0] || {};
    setShowShot(shotData);
    const firearm = data2?.firearm[0] || {};
    setShowFirearm(firearm);
  }, [data, data2]);

  // if (data) {
  //   console.log(data);
  //   console.log(showShot);
  // }

  // routine to edit the selected log entry
  const handleEditLog = async (event) => {
    try {
      const response = await editLogEntry({
        variables: {
          _id: showShot._id,
          userId: showShot.userId,
          date: date,
          target: targetNumber,
          shot: shotNumber,
          firearmId: firearmId,
          measureSystem: showShot.measureSystem,
          temperature: showShot.temperature,
          humidity: showShot.humidity,
          windSpeed: showShot.windSpeed,
          windDirection: showShot.windDirection,
          scoreRing: showShot.scoreRing,
          scoreX: showShot.scoreX,
          scoreOrientation: showShot.scoreOrientation,
          projectileType: showShot.projectileType,
          projectileDiameter: showShot.projectileDiameter,
          projectileWeight: showShot.projectileWeight,
          patchMaterial: showShot.patchMaterial,
          patchThickness: showShot.patchThickness,
          patchLube: showShot.patchLube,
          powderBrand: showShot.powderBrand,
          powderGrade: showShot.powderGrade,
          powderLot: showShot.powderLot,
          powderCharge: showShot.powderCharge,
        },
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  // routine to delete a firearm
  const handleDeleteLogEntry = async () => {
    try {
      const response = await deleteLogEntry({
        variables: {
          _id: showShot._id,
        },
      });
      console.log(response);
      window.location.replace(`/logs/targets/shots/${date}&${target}`);
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

    setShowShot({ ...showShot, [name]: value });
    // console.log(showShot);
  };

  const handleFirearmChange = (event) => {
    // handling multiple input types
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setShowFirearm({ ...showFirearm, [name]: value });
    // console.log(showShot);
  };

  if (data && showShot.measureSystem === true) {
    measureInches = ' (mm)';
    measureSpeed = ' (Kph)';
    measureTemp = ' (C)';
    measureMass = ' (g)';
  }

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (error) {
    return <h4>There was a loading error... {error.message}</h4>;
  }

  return (
    <>
      <div>
        <h3 className="text-center">Range Session</h3>
        <Link to={{ pathname: `/logs/targets/${date}` }}>
          <p className="text-center">{date}</p>
        </Link>
        <div className="text-center">
          <h4 className="d-inline-block">Target</h4>
          <Link to={{ pathname: `/logs/targets/shots/${date}&${target}` }}>
            <span className="m-2 float-right">{targetNumber}</span>
          </Link>
        </div>
        <div className="text-center">
          <h4 className="d-inline-block">Shot</h4>
          <span className="m-2 float=right">{shotNumber}</span>
        </div>
      </div>
      <Form onSubmit={handleEditLog}>
        <Form.Group>
          <Form.Label className="m-2">Firearm:</Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="name"
            value={showFirearm.name || ''}
            onChange={handleFirearmChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Temperature: {measureTemp}</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="temperature"
            value={showShot.temperature || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Humidity:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="humidity"
            value={showShot.humidity || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Wind Speed: {measureSpeed}</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="windSpeed"
            value={showShot.windSpeed || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Wind Direction:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="windDirection"
            value={showShot.windDirection || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Score Ring:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="scoreRing"
            value={showShot.scoreRing || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Score X:</Form.Label>
          <Form.Check
            className="m-2 p-2"
            type="checkbox"
            name="scoreX"
            checked={showShot.scoreX || false}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Score Orientation:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="scoreOrientation"
            value={showShot.scoreOrientation || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Round Ball:</Form.Label>
          <Form.Check
            className="m-2 p-2"
            type="checkbox"
            name="projectileType"
            checked={showShot.projectileType || false}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Bullet Dia: {measureInches}</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="projectileDiameter"
            value={showShot.projectileDiameter || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Bullet Weight: {measureMass}</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="projectileWeight"
            value={showShot.projectileWeight || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Patch Material:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="patchMaterial"
            value={showShot.patchMaterial || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Patch Size: {measureInches}</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="patchThickness"
            value={showShot.patchThickness || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Patch Lube</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="patchLube"
            value={showShot.patchLube || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Powder Brand:</Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="powderBrand"
            value={showShot.powderBrand || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Powder Grade:</Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="powderGrade"
            value={showShot.powderGrade || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Powder Lot:</Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="powderLot"
            value={showShot.powderLot || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info" className="bg-info">
          <Form.Label className="m-2">Powder Charge: {measureMass}</Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="powderCharge"
            value={showShot.powderCharge || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Metric:</Form.Label>
          <Form.Check
            className="m-2 p-2 float-end"
            type="checkbox"
            name="measureSystem"
            checked={showShot.measureSystem || false}
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
          onClick={handleDeleteLogEntry}
        >
          Delete Log Entry
        </Button>
      </Form>
    </>
  );
};

export default Shots;

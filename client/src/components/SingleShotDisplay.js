import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_LOG_ENTRIES_BY_SHOT, GET_FIREARM } from '../utils/queries';
// import { EDIT_LOG_ENTRY, REMOVE_LOG_ENTRY } from '../utils/mutations';
import { EDIT_LOG_ENTRY } from '../utils/mutations';
import { ClockIcon } from '@heroicons/react/24/outline';
import AuthService from '../utils/auth';
import { Form, Button } from 'react-bootstrap';
import Units from '../utils/units.js';

const ShotDisplay = ({ date, target, shot, numberTargets, firearmId }) => {
  const targetNumber = parseInt(target);
  const shotNumber = parseInt(shot);

  const [showShot, setShowShot] = useState();
  const [showFirearm, setShowFirearm] = useState();

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace('/');
  }

  const { loading, error, data } = useQuery(
    GET_LOG_ENTRIES_BY_SHOT,
    { variables: { date: date, target: target, shot: shot } },
    { skip: !loggedIn }
  );

  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(
    GET_FIREARM,
    { variables: { _id: firearmId } },
    { skip: !loggedIn }
  );

  const [editLogEntry] = useMutation(EDIT_LOG_ENTRY);

  // const [deleteLogEntry] = useMutation(REMOVE_LOG_ENTRY);

  useEffect(() => {
    const shotData = data?.logsByShot[0] || {};
    setShowShot(shotData);
  }, [data]);

  useEffect(() => {
    const firearm = data2?.firearm[0] || {};
    setShowFirearm(firearm);
  }, [data2]);

  // routine to edit the selected log entry
  const handleEditLog = async (event) => {
    try {
      const response = await editLogEntry({
        variables: {
          _id: showShot._id,
          date: date,
          target: targetNumber,
          shot: shotNumber,
          firearmId: firearmId,
          targetType: showShot.targetType,
          targetDistance: showShot.targetDistance,
          shootingPosition: showShot.shootingPosition,
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
          notes: showShot.notes,
        },
      });
      console.log(response);
      window.location.replace(
        `/logs/targets/shots/shot/${date}&${targetNumber}&${numberTargets}&${shotNumber}&${firearmId}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  // routine to delete a firearm
  // const handleDeleteLogEntry = async () => {
  //   try {
  //     const response = await deleteLogEntry({
  //       variables: {
  //         _id: showShot._id,
  //       },
  //     });
  //     console.log(response);
  //     // must check if deleting target and adjust target and numberTargets
  //     // if shot === 1 then deleting shot deletes target
  //     let targets = numberTargets;
  //     if (shot === 1 && target === 1) {
  //       window.location.replace(`/logs`);
  //     } else if (shot === 1 && target > 1) {
  //       target = target - 1;
  //       targets = numberTargets - 1;
  //       window.location.replace(
  //         `/logs/targets/shots/${date}&${target}&${targets}`
  //       );
  //     } else {
  //       window.location.replace(
  //         `/logs/targets/shots/${date}&${target}&${targets}`
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (error) {
    return <h4>There was a loading error... {error.message}</h4>;
  }

  if (loading2) {
    return <h4>Loading...</h4>;
  }

  if (error2) {
    return <h4>There was a loading error... {error2.message}</h4>;
  }

  // Call Units method to switch units if measureSystem is metric (true)
  Units.switchUnits(showShot?.measureSystem);

  return (
    <div className="single-shot-page ">
      <div>
        <p className="d-inline-block m-2">Firearm: </p>
        <span className="m-2">{showFirearm?.name}</span>
      </div>
      <Form onSubmit={handleEditLog}>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Target Type: </Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="targetType"
            value={showShot?.targetType || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">
            Target Distance: {Units.measureYards}
          </Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="number"
            name="targetDistance"
            value={showShot?.targetDistance || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Shooting Position:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="shootingPosition"
            value={showShot?.shootingPosition || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">
            Temperature: {Units.measureTemp}
          </Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="number"
            name="temperature"
            value={showShot?.temperature || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Humidity: (%)</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="number"
            name="humidity"
            value={showShot?.humidity || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">
            Wind Speed: {Units.measureSpeed}
          </Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="number"
            name="windSpeed"
            value={showShot?.windSpeed || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Wind Direction:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="windDirection"
            value={showShot?.windDirection || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Score Ring:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="number"
            name="scoreRing"
            value={showShot?.scoreRing || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Score X:</Form.Label>
          <Form.Check
            className="m-2 p-2"
            type="checkbox"
            name="scoreX"
            checked={showShot?.scoreX || false}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">
            Score Orientation:
            <ClockIcon className="clock-face" />
          </Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="number"
            name="scoreOrientation"
            value={showShot?.scoreOrientation || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Round Ball: (vs. Conical)</Form.Label>
          <Form.Check
            className="m-2 p-2"
            type="checkbox"
            name="projectileType"
            checked={showShot?.projectileType || false}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">
            Bullet Dia: {Units.measureInch}
          </Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="number"
            name="projectileDiameter"
            value={showShot?.projectileDiameter || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">
            Bullet Weight: {Units.measureMass}
          </Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="number"
            name="projectileWeight"
            value={showShot?.projectileWeight || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Patch Material:</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="patchMaterial"
            value={showShot?.patchMaterial || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">
            Patch Size: {Units.measureInch}
          </Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="number"
            name="patchThickness"
            value={showShot?.patchThickness || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Patch Lube</Form.Label>

          <Form.Control
            className="w-50 float-end"
            type="text"
            name="patchLube"
            value={showShot?.patchLube || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Powder Brand:</Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="powderBrand"
            value={showShot?.powderBrand || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Powder Grade:</Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="powderGrade"
            value={showShot?.powderGrade || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Powder Lot:</Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="text"
            name="powderLot"
            value={showShot?.powderLot || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">
            Powder Charge: {Units.measureMass}
          </Form.Label>
          <Form.Control
            className="w-50 float-end"
            type="number"
            name="powderCharge"
            value={showShot?.powderCharge || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="bg-info">
          <Form.Label className="m-2">Metric: (vs. English)</Form.Label>
          <Form.Check
            className="m-2 p-2 float-end"
            type="checkbox"
            name="measureSystem"
            checked={showShot?.measureSystem || false}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="m-2">Notes:</Form.Label>
          <Form.Control
            as="textarea"
            rows="4"
            name="notes"
            value={showShot?.notes || ''}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Button className="p-1 m-2" type="submit" variant="primary">
          Submit Edits
        </Button>
        {/* <Button
          className="p-1 m-2"
          type="button"
          variant="danger"
          onClick={handleDeleteLogEntry}
        >
          Delete Log Entry
        </Button> */}
      </Form>
    </div>
  );
};

export default ShotDisplay;

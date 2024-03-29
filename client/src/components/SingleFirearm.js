import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FIREARM } from '../utils/queries';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Units from '../utils/units';
import AuthService from '../utils/auth';
import { EDIT_FIREARM, REMOVE_FIREARM } from '../utils/mutations';

const SingleFirearm = () => {
  // id passed to component through URI parameters from Route in App.js
  const { id } = useParams();

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace('/');
  }

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
    event.preventDefault();
    try {
      // TODO: check if network online
      // if not online, write firearm info in variables below to indexedDB(firearm)
      // if (!OfflineService.onlineCheck()) {
      //  OfflineService.saveFirearmData(firearmData, "EDIT", id);
      // } else {
      const response = await editFirearm({
        variables: {
          _id: id,
          name: firearmData.name,
          ignitionType: firearmData.ignitionType,
          barrelLength: firearmData.barrelLength,
          caliber: firearmData.caliber,
          diaTouchHole: firearmData.diaTouchHole,
          distanceToTarget: firearmData.distanceToTarget,
          muzzleVelocity: firearmData.muzzleVelocity,
          diaRearSight: firearmData.diaRearSight,
          diaFrontSight: firearmData.diaFrontSight,
          heightFrontSight: parseFloat(frontSightHeight().toFixed(3)),
          heightRearSight: firearmData.heightRearSight,
          sightRadius: firearmData.sightRadius,
          notes: firearmData.notes,
          measureSystem: firearmData.measureSystem,
        },
      });
      console.log(response);
      window.location.replace(`/firearms/single/${id}`);
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
  };

  // routine to delete a firearm
  const handleFirearmDelete = async () => {
    try {
      // TODO: check if network online
      // if not online, write firearm info in variables below to indexedDB(firearm)
      // if (!OfflineService.onlineCheck()) {
      //  OfflineService.saveFirearmData(showFirearm, "ADD");
      // } else {
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

  // Call Units method to switch units if measureSystem is metric (true)
  Units.switchUnits(firearmData?.measureSystem);

  // routine to calculate the front sight height
  const frontSightHeight = () => {
    const distanceToTarget = firearmData.distanceToTarget;
    const muzzleVelocity = firearmData.muzzleVelocity;
    const frontSightHeight =
      0.5 * firearmData.diaRearSight +
      firearmData.heightRearSight -
      0.5 * firearmData.diaFrontSight;

    const centerBoreToSightLine =
      firearmData.diaRearSight * 0.5 + firearmData.heightRearSight;

    if (firearmData.measureSystem) {
      // Metric calculations
      const accelerationDueToGravity = 9.81; // m/s2

      const bulletDrop =
        0 -
        0.5 *
          (accelerationDueToGravity *
            (distanceToTarget / muzzleVelocity) ** 2) *
          1000; // mm

      const bulletDropFromSightLine = bulletDrop - centerBoreToSightLine;

      const frontSightHeightCorrection =
        firearmData.sightRadius *
        (bulletDropFromSightLine /
          (distanceToTarget * 1000 + firearmData.sightRadius)); // mm

      const correctedFrontSightHeight =
        frontSightHeight + frontSightHeightCorrection; // mm
      return correctedFrontSightHeight;
    } else {
      // English calculations
      const accelerationDueToGravity = 32.19; // ft/s2

      const bulletDrop =
        0 -
        0.5 *
          (accelerationDueToGravity *
            ((distanceToTarget * 3) / muzzleVelocity) ** 2) *
          12;

      const bulletDropFromSightLine = bulletDrop - centerBoreToSightLine;

      const frontSightHeightCorrection =
        firearmData.sightRadius *
        (bulletDropFromSightLine /
          (distanceToTarget * 36 + firearmData.sightRadius));

      const correctedFrontSightHeight =
        frontSightHeight + frontSightHeightCorrection; // inches

      return correctedFrontSightHeight;
    }
  };

  return (
    <div className="background-wrap">
      <div>
        <img
          className="background-image"
          src="/assets/images/target_background-1.jpg"
          alt="background target"
        ></img>
      </div>
      <div className="background-content single-firearm">
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
            <span>{Units.measureInches}</span>
            <Form.Control
              className="w-50 float-end"
              type="number"
              step="0.01"
              name="barrelLength"
              value={firearmData.barrelLength || ''}
              onChange={handleDataChange}
            />
          </Form.Group>
          <Form.Group className="bg-info">
            <Form.Label className="m-2">Caliber:</Form.Label>
            <span>{Units.measureInches}</span>
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
            <span>{Units.measureInch}</span>
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
            <Form.Label className="m-2">*Distance:</Form.Label>
            <span>{Units.measureYards}</span>
            <Form.Control
              className="w-50 float-end"
              type="number"
              name="distanceToTarget"
              value={firearmData.distanceToTarget || ''}
              onChange={handleDataChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="m-2">*Velocity:</Form.Label>
            <span>{Units.measureVelocity}</span>
            <Form.Control
              className="w-50 float-end"
              type="number"
              name="muzzleVelocity"
              value={firearmData.muzzleVelocity || ''}
              onChange={handleDataChange}
            />
          </Form.Group>
          <Form.Group className="bg-info">
            <Form.Label className="m-2">*Dia@Rear Sight:</Form.Label>
            <span>{Units.measureInches}</span>
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
            <Form.Label className="m-2">*Dia@Front Sight:</Form.Label>
            <span>{Units.measureInches}</span>
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
            <Form.Label className="m-2">*Height Rear Sight:</Form.Label>
            <span>{Units.measureInches}</span>
            <Form.Control
              className="w-50 float-end"
              type="number"
              step="0.001"
              name="heightRearSight"
              value={firearmData.heightRearSight || ''}
              onChange={handleDataChange}
            />
          </Form.Group>
          <Form.Group className="bg-success text-white">
            <Form.Label className="m-2">*Height Front Sight:</Form.Label>
            <span>{Units.measureInches}</span>
            <Form.Control
              className="w-50 float-end"
              type="number"
              step="0.001"
              name="heightFrontSight"
              value={frontSightHeight().toFixed(3) || ''}
              onChange={handleDataChange}
            />
          </Form.Group>
          <Form.Group className="bg-info">
            <Form.Label className="m-2">*Sight Radius:</Form.Label>
            <span>{Units.measureInches}</span>
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
          <Form.Group>
            <Form.Label className="m-2">Notes:</Form.Label>
            <Form.Control
              as="textarea"
              rows="4"
              name="notes"
              value={firearmData.notes || ''}
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
        <p className="m-2">
          * Used in calculation of front sight height. Click on Submit to save.
        </p>
      </div>
    </div>
  );
};

export default SingleFirearm;

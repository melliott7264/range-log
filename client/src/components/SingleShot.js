import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_LOG_ENTRIES_BY_SHOT, GET_FIREARM } from '../utils/queries';
import { ADD_LOG_ENTRY } from '../utils/mutations';
import dayjs from 'dayjs';
import AuthService from '../utils/auth';
import { Form, Button, Modal } from 'react-bootstrap';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import SingleShotDisplay from './SingleShotDisplay';

const Shots = () => {
  const { date, target, numberTargets, shot, numberShots, firearmId } =
    useParams();
  const targetNumber = parseInt(target);
  const [currentTarget, setCurrentTarget] = useState(targetNumber);
  const numberTargetsInt = parseInt(numberTargets);
  const shotNumber = parseInt(shot);
  const [currentShot, setCurrentShot] = useState(shotNumber);
  const numberShotsInt = parseInt(numberShots);
  const [currentNumberShots, setCurrentNumberShots] = useState(numberShotsInt);

  // state controlling modal to add a new session
  const [showModal, setShowModal] = useState(false);

  const [showShot, setShowShot] = useState();
  const [showFirearm, setShowFirearm] = useState();

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace('/');
  }

  const [addLogEntry] = useMutation(ADD_LOG_ENTRY);

  // initialize units of measure
  let measureInches = ' (in)';
  let measureInch = ' (.001")';
  let measureSpeed = ' (Mph)';
  let measureTemp = ' (F)';
  let measureMass = ' (gr)';

  const { loading, error, data } = useQuery(
    GET_LOG_ENTRIES_BY_SHOT,
    { variables: { date: date, target: currentTarget, shot: currentShot } },
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

  useEffect(() => {
    const shotData = data?.logsByShot[0] || {};
    setShowShot(shotData);
    const firearm = data2?.firearm[0] || {};
    setShowFirearm(firearm);
  }, [data, data2]);

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

  if (showShot?.measureSystem === true) {
    measureInches = ' (mm)';
    measureInch = ' (0.01mm)';
    measureSpeed = ' (Kph)';
    measureTemp = ' (C)';
    measureMass = ' (g)';
  }

  // routine to add a log entry
  const handleAddLogEntry = async () => {
    try {
      const response = await addLogEntry({
        variables: {
          date: date,
          target: targetNumber,
          shot: numberShotsInt + 1,
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
      // return to shots listing to make sure number of shots gets updated
      window.location.replace(
        `/logs/targets/shots/${date}&${currentTarget}&${numberTargetsInt}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onNextTarget = () => {
    if (currentTarget < numberTargetsInt) {
      setCurrentTarget(currentTarget + 1);
      // must update the number of shots for new target
      // will do this by calling the shots component
      window.location.replace(
        `/logs/targets/shots/${date}&${currentTarget + 1}&${numberTargetsInt}`
      );
    }
  };

  const onPreviousTarget = () => {
    if (currentTarget > 1) {
      setCurrentTarget(currentTarget - 1);
      // must update the number of shots for new target
      // will do this by calling the shots component
      window.location.replace(
        `/logs/targets/shots/${date}&${currentTarget - 1}&${numberTargetsInt}`
      );
    }
  };

  const onNextShot = () => {
    if (currentShot < numberShotsInt) {
      setCurrentShot(currentShot + 1);
    }
  };

  const onPreviousShot = async () => {
    if (currentShot > 1) {
      setCurrentShot(currentShot - 1);
    }
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
    return <h4>There was a loading error... {error.message}</h4>;
  }

  return (
    <>
      <div>
        <h3 className="text-center">Range Session</h3>
        <Link to={{ pathname: `/logs/targets/${date}` }}>
          <p className="text-center">
            {dayjs(parseInt(date)).format('YYYY-MM-DD')}
          </p>
        </Link>
        <div className="text-center">
          <button
            type="button"
            className="arrowButton left"
            onClick={onPreviousTarget}
            disabled={currentTarget === 1 ? true : false}
          >
            <ChevronLeftIcon className="button-icon" />
          </button>
          <h4 className="d-inline-block p-2">Target</h4>
          <Link
            to={{
              pathname: `/logs/targets/shots/${date}&${currentTarget}&${numberTargets}`,
            }}
          >
            <span className="m-2 float-right">{currentTarget}</span>
          </Link>
          <button
            type="button"
            className="arrowButton right"
            onClick={onNextTarget}
            disabled={currentTarget === numberTargetsInt ? true : false}
          >
            <ChevronRightIcon className="button-icon" />
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className="arrowButton left"
            onClick={onPreviousShot}
            disabled={currentShot === 1 ? true : false}
          >
            <ChevronLeftIcon className="button-icon" />
          </button>
          <h4 className="d-inline-block p-2"> Shot</h4>

          <span className="m-2 float=right">{currentShot}</span>
          {/* </Link> */}
          <button
            type="button"
            className="arrowButton right"
            onClick={onNextShot}
            disabled={currentShot === numberShotsInt ? true : false}
          >
            <ChevronRightIcon className="button-icon" />
          </button>
        </div>
      </div>
      <div className="text-center">
        <Button
          className="btn p-1 text-white"
          onClick={() => setShowModal(true)}
        >
          Add Shot
        </Button>
      </div>
      <SingleShotDisplay
        date={date}
        target={currentTarget}
        shot={currentShot}
        numberTargets={numberTargetsInt}
        firearmId={firearmId}
      />

      <Modal
        size="md"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="add-session-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-session-modal">
            <h4>Add New Shot</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className="d-inline-block">Firearm: </p>
            <span className="m-2">{showFirearm.name}</span>
          </div>
          <Form onSubmit={handleAddLogEntry}>
            <Form.Group className="bg-info">
              <Form.Label className="m-2">
                Temperature: {measureTemp}
              </Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="number"
                name="temperature"
                value={showShot?.temperature || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Humidity:</Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="number"
                name="humidity"
                value={showShot?.humidity || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group className="bg-info">
              <Form.Label className="m-2">
                Wind Speed: {measureSpeed}
              </Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="number"
                name="windSpeed"
                value={showShot?.windSpeed || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Wind Direction:</Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="text"
                name="windDirection"
                value={showShot?.windDirection || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group className="bg-info">
              <Form.Label className="m-2">Score Ring:</Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="number"
                name="scoreRing"
                value={showShot?.scoreRing || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Score X:</Form.Label>
              <Form.Check
                className="m-2 p-2"
                type="checkbox"
                name="scoreX"
                checked={showShot?.scoreX || false}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group className="bg-info">
              <Form.Label className="m-2">Score Orientation:</Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="number"
                name="scoreOrientation"
                value={showShot?.scoreOrientation || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Round Ball:</Form.Label>
              <Form.Check
                className="m-2 p-2"
                type="checkbox"
                name="projectileType"
                checked={showShot?.projectileType || false}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group className="bg-info">
              <Form.Label className="m-2">Bullet Dia: {measureInch}</Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="number"
                name="projectileDiameter"
                value={showShot?.projectileDiameter || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">
                Bullet Weight: {measureMass}
              </Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="number"
                name="projectileWeight"
                value={showShot?.projectileWeight || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group className="bg-info">
              <Form.Label className="m-2">Patch Material:</Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="text"
                name="patchMaterial"
                value={showShot?.patchMaterial || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Patch Size: {measureInch}</Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="number"
                name="patchThickness"
                value={showShot?.patchThickness || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group className="bg-info">
              <Form.Label className="m-2">Patch Lube</Form.Label>

              <Form.Control
                className="w-50 float-end"
                type="text"
                name="patchLube"
                value={showShot?.patchLube || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Powder Brand:</Form.Label>
              <Form.Control
                className="w-50 float-end"
                type="text"
                name="powderBrand"
                value={showShot?.powderBrand || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group className="bg-info">
              <Form.Label className="m-2">Powder Grade:</Form.Label>
              <Form.Control
                className="w-50 float-end"
                type="text"
                name="powderGrade"
                value={showShot?.powderGrade || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Powder Lot:</Form.Label>
              <Form.Control
                className="w-50 float-end"
                type="text"
                name="powderLot"
                value={showShot?.powderLot || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group className="bg-info">
              <Form.Label className="m-2">
                Powder Charge: {measureMass}
              </Form.Label>
              <Form.Control
                className="w-50 float-end"
                type="number"
                name="powderCharge"
                value={showShot?.powderCharge || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Metric:</Form.Label>
              <Form.Check
                className="m-2 p-2 float-end"
                type="checkbox"
                name="measureSystem"
                checked={showShot?.measureSystem || false}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Shots;

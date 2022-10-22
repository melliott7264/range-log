import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_LOG_ENTRIES_BY_TARGET, GET_FIREARM } from '../utils/queries';
import { ADD_LOG_ENTRY } from '../utils/mutations';
import dayjs from 'dayjs';
import AuthService from '../utils/auth';
import { Form, Button, Modal } from 'react-bootstrap';
import { ClockIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import SingleShotDisplay from './SingleShotDisplay';
import { getTargetScore } from '../utils/utils.js';
import Units from '../utils/units.js';

const SingleShot = () => {
  const { date, target, numberTargets, shot, firearmId } = useParams();
  const targetNumber = parseInt(target);
  const [currentTarget, setCurrentTarget] = useState(targetNumber);
  const numberTargetsInt = parseInt(numberTargets);
  const shotNumber = parseInt(shot);
  const [currentShot, setCurrentShot] = useState(shotNumber);

  // state controlling modal to add a new session
  const [showModal, setShowModal] = useState(false);

  // state controlling all the shot data for a target
  const [showShots, setShowShots] = useState();

  // states controlling what is passed to SingleShotDisplay
  const [showShot, setShowShot] = useState();
  const [showFirearm, setShowFirearm] = useState();

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace('/');
  }

  const [addLogEntry] = useMutation(ADD_LOG_ENTRY);

  // get all the shots for a target so that we can get an array of shots for shot pagination as well
  // as individual shot data to add a new shot
  const { loading, error, data } = useQuery(
    GET_LOG_ENTRIES_BY_TARGET,
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
    const shotsData = data?.logsByTarget || [];
    setShowShots(shotsData);
    const firearm = data2?.firearm[0] || {};
    setShowFirearm(firearm);
    // create showShot array to get current shot data
    setShowShot(
      shotsData.filter((shot) => {
        return shot.shot === currentShot;
      })
    );
  }, [data, data2, currentShot]);

  // Call Units method to switch units if measureSystem is metric (true)
  Units.switchUnits(showShot?.measureSystem);

  // Need to get the array of shots to paginate through them
  const shotArray = () => {
    return showShots.map((shot) => {
      return shot.shot;
    });
  };

  // Need to get the largest shot number for adding the next shot and to pass to SingleShot
  const lastShot = () => {
    // call the function to get the shotArray
    // return the largest number in the array
    return Math.max(...shotArray());
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

  // routine to add a log entry
  const handleAddLogEntry = async () => {
    try {
      const response = await addLogEntry({
        variables: {
          date: date,
          target: targetNumber,
          shot: lastShot() + 1,
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
      // redisplay shots after adding a new one
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
    if (currentShot < lastShot()) {
      //need to find the shot location in the array and go to the shot at the next index
      setCurrentShot(shotArray()[shotArray().indexOf(currentShot) + 1]);
    }
  };

  const onPreviousShot = async () => {
    if (currentShot > Math.min(...shotArray())) {
      setCurrentShot(shotArray()[shotArray().indexOf(currentShot) - 1]);
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
          <h5>Target Score: {getTargetScore(showShots)}</h5>
        </div>
        <div className="text-center">
          <button
            type="button"
            className="arrowButton left"
            onClick={onPreviousShot}
            disabled={currentShot === Math.min(...shotArray()) ? true : false}
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
            disabled={currentShot === lastShot() ? true : false}
          >
            <ChevronRightIcon className="button-icon" />
          </button>
        </div>
      </div>
      <div className="text-center">
        <Button
          className="btn p-1 text-white"
          onClick={() => {
            //seeds new shot with data from last shot
            setShowShot(showShots[showShots.length - 1]);
            setShowModal(true);
          }}
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
              <Form.Label className="m-2">Humidity:</Form.Label>

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
              <Form.Label className="m-2">Round Ball:</Form.Label>
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
              <Form.Label className="m-2">Metric:</Form.Label>
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
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SingleShot;

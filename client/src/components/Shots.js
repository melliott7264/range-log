import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_LOG_ENTRIES_BY_TARGET, GET_ALL_FIREARMS } from '../utils/queries';
import { ADD_LOG_ENTRY } from '../utils/mutations';
import { Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import AuthService from '../utils/auth';
import { getTargetScore } from '../utils/utils.js';
import Units from '../utils/units.js';

const Shots = () => {
  const { date, target, numberTargets } = useParams();
  const targetNumber = parseInt(target);
  const [currentTarget, setCurrentTarget] = useState(targetNumber);
  const numberTargetsInt = parseInt(numberTargets);

  // state controlling modal to add a new shot
  const [showModal, setShowModal] = useState(false);

  // state controlling shots listing for target
  const [showShots, setShowShots] = useState();

  // state controlling listing of all firearms for the logged in user
  const [showFirearms, setShowFirearms] = useState();

  const [showShot, setShowShot] = useState();
  const [firearmName, setFirearmName] = useState();

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace('/');
  }

  const [addLogEntry] = useMutation(ADD_LOG_ENTRY);

  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(
    GET_LOG_ENTRIES_BY_TARGET,
    {
      variables: { date: date, target: currentTarget },
    },
    { skip: !loggedIn }
  );

  useEffect(() => {
    const shotsData = data2?.logsByTarget || [];
    setShowShots(shotsData);
  }, [data2]);

  const {
    loading: loading3,
    error: error3,
    data: data3,
  } = useQuery(GET_ALL_FIREARMS, {
    skip: !loggedIn,
  });

  useEffect(() => {
    const firearms = data3?.firearmsByUser || {};
    setShowFirearms(firearms);
    // Find name associated with firearmId
    if (showFirearms && showShots[0]?.firearmId) {
      for (let i = 0; i < showFirearms.length; i++) {
        if (showFirearms[i]._id === showShots[0].firearmId) {
          setFirearmName(showFirearms[i].name);
        }
      }
      // seeds new shot with data from last shot
      setShowShot(showShots[showShots.length - 1]);
    }
  }, [data3, showFirearms, showShots]);

  if (loading2) {
    return <h4>Loading...</h4>;
  }

  if (error2) {
    return <h4>There was a loading error... {error2.message}</h4>;
  }

  if (loading3) {
    return <h4>Loading...</h4>;
  }

  if (error3) {
    return <h4>There was a loading error... {error3.message}</h4>;
  }

  // Need to get the array of shots to paginate through them
  // const shotArray = () => {
  //   // get an array of the shots
  //   let shotArray = [];
  //   for (let i = 0; i < showShots.length; i++) {
  //     shotArray.push(showShots[i].shot);
  //   }
  //   return shotArray;
  // };

  // Need to get the largest shot number for adding the next shot and to pass to SingleShot
  const lastShot = () => {
    // call the function to get the shotArray
    // return the length of the shot array
    return showShots.length;
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

  // Call Units method to switch units if measureSystem is metric (true)
  Units.switchUnits(showShot?.measureSystem);

  // routine to add a log entry
  const handleAddLogEntry = async (event) => {
    event.preventDefault();
    try {
      const response = await addLogEntry({
        variables: {
          date: date,
          target: currentTarget,
          shot: lastShot() + 1,
          firearmId: showShot.firearmId,
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
        `/logs/targets/shots/${date}&${currentTarget}&${numberTargetsInt}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onNextTarget = () => {
    if (currentTarget < numberTargetsInt) {
      setCurrentTarget(currentTarget + 1);
    }
  };

  const onPreviousTarget = () => {
    if (currentTarget > 1) {
      setCurrentTarget(currentTarget - 1);
    }
  };

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
          <h4 className="d-inline-block">Target</h4>
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
        <h5 className="text-center">Shots</h5>
      </div>
      <div className="text-center">
        <Button
          className="btn p-1 text-white"
          onClick={() => setShowModal(true)}
        >
          Add Shot
        </Button>
      </div>
      <ul className="list-group">
        {showShots.map((shot) => (
          <li key={shot.shot} className="list-group-item">
            <div className="row">
              <div className="col-md-12">
                <Link
                  to={{
                    pathname: `/logs/targets/shots/shot/${date}&${currentTarget}&${numberTargets}&${shot.shot}&${shot.firearmId}`,
                  }}
                >
                  <p className="text-center">{shot.shot}</p>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
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
            <span className="m-2">{firearmName}</span>
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
              <Form.Label className="m-2">Score Orientation:</Form.Label>

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

export default Shots;

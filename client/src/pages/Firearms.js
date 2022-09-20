import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_FIREARMS } from '../utils/queries';
import { Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AuthService from '../utils/auth';
import { ADD_FIREARM } from '../utils/mutations';

const Firearms = () => {
  // state to show listing of user firearms from which to select
  const [showFirearms, setShowFirearms] = useState([]);
  // state controlling modal to add new firearm
  const [showModal, setShowModal] = useState(false);
  // state controlling added firearm
  const [showFirearm, setShowFirearm] = useState('');

  const loggedIn = AuthService.loggedIn();

  let measureInches = ' (inches)';

  const [addFirearm] = useMutation(ADD_FIREARM);

  // Graphql query for a listing of all firearms - using skip parameter to avoid error when not logged in
  const { data } = useQuery(GET_ALL_FIREARMS, { skip: !loggedIn });

  useEffect(() => {
    const firearmsList = data?.firearmsByUser || [];
    setShowFirearms(firearmsList);
  }, [data]);

  // routine to add a firearm
  const handleAddFirearm = async (event) => {
    try {
      const response = await addFirearm({
        variables: {
          name: showFirearm.name,
          ignitionType: showFirearm.ignitionType,
          barrelLength: showFirearm.barrelLength,
          caliber: showFirearm.caliber,
          diaTouchHole: showFirearm.diaTouchHole,
          diaRearSight: showFirearm.diaRearSight,
          diaFrontSight: showFirearm.diaFrontSight,
          heightFrontSight: showFirearm.heightFrontSight,
          heightRearSight: showFirearm.heightRearSight,
          sightRadius: showFirearm.sightRadius,
          measureSystem: showFirearm.measureSystem,
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

    setShowFirearm({ ...showFirearm, [name]: value });
  };

  if (showFirearm.measureSystem === true) {
    measureInches = ' (mm)';
  }

  return (
    <>
      <div>
        <div className="container ">
          <div className="row">
            <div className="text-center">
              <h3>Firearms</h3>
            </div>
            <span className="text-center">
              <Button
                className="btn p-1 text-white"
                onClick={() => setShowModal(true)}
              >
                Add Firearm
              </Button>
            </span>
          </div>
        </div>

        <ul className="list-group">
          {showFirearms.map((firearm) => (
            <li key={firearm._id} className="list-group-item">
              <div className="row">
                <div className="col-md-12">
                  <Link to={{ pathname: `/firearms/single/${firearm._id}` }}>
                    <h4>{firearm.name}</h4>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        size="md"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="add-firearm-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-firearm-modal">
            <h4>Add New Firearm </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddFirearm}>
            <Form.Group>
              <Form.Label>Name/Description:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={showFirearm.name || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ignition Type:</Form.Label>
              <Form.Control
                type="text"
                name="ignitionType"
                value={showFirearm.ignitionType || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Barrel Length(inches/mm):</Form.Label>
              <span>{measureInches}</span>
              <Form.Control
                type="number"
                step="1"
                name="barrelLength"
                value={showFirearm.barrelLength || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Caliber(inches/mm):</Form.Label>
              <span>{measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="caliber"
                value={showFirearm.caliber || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Dia. Touch Hole:</Form.Label>
              <span>{measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="diaTouchHole"
                value={showFirearm.diaTouchHole || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Dia. @ Rear Sight:</Form.Label>
              <span>{measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="diaRearSight"
                value={showFirearm.diaRearSight || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Dia. @ Front Sight:</Form.Label>
              <span>{measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="diaFrontSight"
                value={showFirearm.diaFrontSight || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Height Rear Sight:</Form.Label>
              <span>{measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="heightRearSight"
                value={showFirearm.heightRearSight || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Height Front Sight:</Form.Label>
              <span>{measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="heightFrontSight"
                value={showFirearm.heightFrontSight || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Sight Radius:</Form.Label>
              <span>{measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="sightRadius"
                value={showFirearm.sightRadius || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Metric:</Form.Label>
              <Form.Check
                type="checkbox"
                name="measureSystem"
                checked={showFirearm.measureSystem || false}
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

export default Firearms;

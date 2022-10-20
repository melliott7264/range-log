import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_FIREARMS } from '../utils/queries';
import { Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';

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
  if (!loggedIn) {
    window.location.replace('/');
  }

  let measureInches = '(in)';
  let measureInch = ' (.001")';
  let measureYard = ' (yd)';
  let measureVelocity = ' (ft/s)';

  const [addFirearm] = useMutation(ADD_FIREARM);

  // Graphql query for a listing of all firearms - using skip parameter to avoid error when not logged in
  const { data } = useQuery(GET_ALL_FIREARMS, { skip: !loggedIn });

  useEffect(() => {
    const firearmsList = data?.firearmsByUser || [];
    setShowFirearms(firearmsList);
  }, [data]);

  // header definition to prepare an export of firearms data to a csv file
  const exportFirearmsHeaders = [
    { label: 'Firearm ID', key: '_id' },
    { label: 'Name', key: 'name' },
    { label: 'Metric', key: 'measureSystem' },
    { label: 'Barrel Length', key: 'barrelLength' },
    { label: 'Caliber', key: 'caliber' },
    { label: 'Ignition Type', key: 'ignitionType' },
    { label: 'Touch Hole Dia', key: 'diaTouchHole' },
    { label: 'Distance', key: 'distanceToTarget' },
    { label: 'Muzzle Velocity', key: 'muzzleVelocity' },
    { label: 'Dia @ Rear Sight', key: 'diaRearSight' },
    { label: 'Dia @ Front Sight', key: 'diaFrontSight' },
    { label: 'Rear Sight Height', key: 'heightRearSight' },
    { label: 'Front Sight Height', key: 'heightFrontSight' },
    { label: 'Sight Radius', key: 'sightRadius' },
    { label: 'Notes', key: 'notes' },
  ];

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
          distanceToTarget: showFirearm.distanceToTarget,
          muzzleVelocity: showFirearm.muzzleVelocity,
          diaRearSight: showFirearm.diaRearSight,
          diaFrontSight: showFirearm.diaFrontSight,
          heightRearSight: showFirearm.heightRearSight,
          sightRadius: showFirearm.sightRadius,
          notes: showFirearm.notes,
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
    measureInches = '(mm)';
    measureInch = ' (0.01mm)';
    measureYard = ' (m)';
    measureVelocity = ' (m/s)';
  }

  return (
    <div>
      <div className="firearms-list">
        <Container>
          <Row>
            <h3 className="text-center">Firearms</h3>
          </Row>
          <Row>
            <Col></Col>
            <Col>
              <Button
                className="p-1 text-center"
                onClick={() => setShowModal(true)}
              >
                Add Firearm
              </Button>
            </Col>
            <Col>
              <CSVLink
                data={showFirearms}
                headers={exportFirearmsHeaders}
                filename={'my_firearms.csv'}
                target="_blank"
              >
                Download Excel Spreadsheet{' '}
              </CSVLink>
            </Col>
          </Row>
        </Container>

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
              <Form.Label>Name:</Form.Label>
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
              <Form.Label>Barrel Length:</Form.Label>
              <span>{measureInches}</span>
              <Form.Control
                type="number"
                step="0.01"
                name="barrelLength"
                value={showFirearm.barrelLength || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Caliber:</Form.Label>
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
              <Form.Label className="m-2">Dia Touch Hole:</Form.Label>
              <span>{measureInch}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="diaTouchHole"
                value={showFirearm.diaTouchHole || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Distance:</Form.Label>
              <span>{measureYard}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="distanceToTarget"
                value={showFirearm.distanceToTarget || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Velocity:</Form.Label>
              <span>{measureVelocity}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="muzzleVelocity"
                value={showFirearm.muzzleVelocity || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Dia@Rear Sight:</Form.Label>
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
              <Form.Label className="m-2">Dia@Front Sight:</Form.Label>
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
            <Form.Group>
              <Form.Label>Notes:</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                name="notes"
                value={showFirearm.notes || ''}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Firearms;

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_FIREARMS } from "../utils/queries";
import { Button, Modal, Form, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../utils/auth";
import { ADD_FIREARM } from "../utils/mutations";
import Units from "../utils/units";

// import Dexie from "dexie";
import { db, init } from "../offline";

const Firearms = () => {
  // state to show listing of user firearms from which to select
  const [showFirearms, setShowFirearms] = useState([]);
  // state controlling modal to add new firearm
  const [showModal, setShowModal] = useState(false);
  // state controlling added firearm
  const [showFirearm, setShowFirearm] = useState("");

  // initialize the indexedDB database for offline data storage
  init();

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace("/");
  }

  const [addFirearm] = useMutation(ADD_FIREARM);

  // Graphql query for a listing of all firearms - using skip parameter to avoid error when not logged in
  const { data } = useQuery(GET_ALL_FIREARMS, { skip: !loggedIn });

  useEffect(() => {
    const firearmsList = data?.firearmsByUser || [];
    setShowFirearms(firearmsList);
  }, [data]);

  // routine to add a firearm
  const handleAddFirearm = async (event) => {
    event.preventDefault();
    try {
      // TODO: check if network online
      // if not online, write firearm info in variables below to indexedDB(firearm)
      if (!navigator.onLine) {
      } else {
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
      }
      window.location.replace(`/firearms`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDataChange = (event) => {
    // handling multiple input types
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    // The following code is necessary because Form.Control type=number actually returns a string
    // parseFloat will also return an integer if an integer is typed as well as returning a float
    if (target.type === "number") {
      value = parseFloat(value);
    }

    setShowFirearm({ ...showFirearm, [name]: value });
  };

  // Call Units method to switch units if measureSystem is metric (true)
  Units.switchUnits(showFirearm?.measureSystem);

  return (
    <div className="background-wrap">
      <div>
        <img
          className="background-image"
          src="/assets/images/target_background-1.jpg"
          alt="background target"
        ></img>
      </div>
      <div className="firearms-list background-content">
        <Container>
          <Row>
            <h3 className="text-center">Firearms</h3>
          </Row>
          <Row>
            <div className="text-center">
              <Button className="p-1" onClick={() => setShowModal(true)}>
                Add Firearm
              </Button>
            </div>
          </Row>
        </Container>

        <ul className="list-group">
          {showFirearms.map((firearm) => (
            <li key={firearm._id} className="list-group-item firearm-list-item">
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
                value={showFirearm.name || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ignition Type:</Form.Label>
              <Form.Control
                type="text"
                name="ignitionType"
                value={showFirearm.ignitionType || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Barrel Length:</Form.Label>
              <span>{Units.measureInches}</span>
              <Form.Control
                type="number"
                step="0.01"
                name="barrelLength"
                value={showFirearm.barrelLength || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Caliber:</Form.Label>
              <span>{Units.measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="caliber"
                value={showFirearm.caliber || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Dia Touch Hole:</Form.Label>
              <span>{Units.measureInch}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="diaTouchHole"
                value={showFirearm.diaTouchHole || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Distance:</Form.Label>
              <span>{Units.measureYards}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="distanceToTarget"
                value={showFirearm.distanceToTarget || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Velocity:</Form.Label>
              <span>{Units.measureVelocity}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="muzzleVelocity"
                value={showFirearm.muzzleVelocity || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Dia@Rear Sight:</Form.Label>
              <span>{Units.measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="diaRearSight"
                value={showFirearm.diaRearSight || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Dia@Front Sight:</Form.Label>
              <span>{Units.measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="diaFrontSight"
                value={showFirearm.diaFrontSight || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Height Rear Sight:</Form.Label>
              <span>{Units.measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="heightRearSight"
                value={showFirearm.heightRearSight || ""}
                onChange={handleDataChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="m-2">Sight Radius:</Form.Label>
              <span>{Units.measureInches}</span>
              <Form.Control
                type="number"
                step="0.001"
                name="sightRadius"
                value={showFirearm.sightRadius || ""}
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
                value={showFirearm.notes || ""}
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

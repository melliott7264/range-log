import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_FIREARMS } from "../utils/queries";
import { Button, Modal, Form, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../utils/auth";
import { ADD_FIREARM } from "../utils/mutations";
import Units from "../utils/units";
import { v4 as uuidv4 } from "uuid";

// import services for indexedDB database for offline storage
import { db, init } from "../utils/offline";

const Firearms = () => {
  // state to show listing of user firearms from which to select
  const [showFirearms, setShowFirearms] = useState([]);
  // state controlling modal to add new firearm
  const [showModal, setShowModal] = useState(false);
  // state controlling added firearm
  const [showFirearm, setShowFirearm] = useState("");

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace("/");
  }

  const [addFirearm] = useMutation(ADD_FIREARM);

  const uploadNewFirearmData = async (firearmData) => {
          // Write new firearm data to MongoDB
          const responseOnline = await addFirearm({
            variables: {
              name: firearmData.name,
              ignitionType: firearmData.ignitionType,
              barrelLength: firearmData.barrelLength,
              caliber: firearmData.caliber,
              diaTouchHole: firearmData.diaTouchHole,
              distanceToTarget: firearmData.distanceToTarget,
              muzzleVelocity: firearmData.muzzleVelocity,
              diaRearSight: firearmData.diaRearSight,
              diaFrontSight: firearmData.diaFrontSight,
              heightRearSight: firearmData.heightRearSight,
              sightRadius: firearmData.sightRadius,
              notes: firearmData.notes,
              measureSystem: firearmData.measureSystem,
            },
          });
          return responseOnline;
  };

const uploadOfflineData = async () => {
  if (db.tables.length === 0) {
    init();
  } else {
    const offlineFirearmAddArray = await db.firearms
      .where({ operation: "ADD" })
      .toArray();
    if (navigator.onLine && offlineFirearmAddArray.length !== 0) {
      console.log(
        "Offline Firearm add array length:  " + offlineFirearmAddArray.length
      );
      for (let i = 0; i < offlineFirearmAddArray.length; i++) {
        const offlineFirearmData = offlineFirearmAddArray[i];
        const responseOnline = await uploadNewFirearmData(offlineFirearmData);
        console.log(
          "Response from MongoDB  " + JSON.stringify(responseOnline)
        );
        const deletionResponse = await db.firearms.delete(
          offlineFirearmData.id
        );
        console.log(
          "firearm has been added to online database and deleted locally: " +
            deletionResponse
        );
      }
      window.location.replace(`/firearms`);
    }
  }
};

// uploadOfflineData();

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
      if (!navigator.onLine) {
        // Write add firearm data to indexedDB when application is offline  - uuid for unique id
        const responseOffline = await db.firearms.put({
          id: uuidv4(),
          operation: "ADD",
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
        });
        console.log(
          "Response from indexedDb  " + JSON.stringify(responseOffline)
        );
      } else {
        // Write new firearm data to MongoDB
        const responseOnline = await addFirearm({
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
        console.log("Response from MongoDB  " + JSON.stringify(responseOnline));
      }
      if (navigator.onLine) {
        window.location.replace(`/firearms`);
      } else {
        window.alert(
          "Application is offline - Your additon will be uploaded to the cloud when back online"
        );
        window.location.replace(`/firearms`);
      }
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

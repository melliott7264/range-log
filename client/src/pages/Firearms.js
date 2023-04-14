import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_FIREARMS } from "../utils/queries";
import { Button, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../utils/auth";
import { ADD_FIREARM, EDIT_FIREARM, REMOVE_FIREARM } from "../utils/mutations";

// import services for indexedDB database for offline storage
import { db, init, firearmDataArray } from "../utils/offline";

const Firearms = () => {
  // state to show listing of user firearms from which to select
  const [showFirearms, setShowFirearms] = useState([]);
  // state to control useEffect running offline update function
  const [updateRequired, setUpdateRequired] = useState(false);

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace("/");
  }

  if (db.tables.length === 0) {
    init();
  }

  const [addFirearm] = useMutation(ADD_FIREARM);

  const [editFirearm] = useMutation(EDIT_FIREARM);

  const [deleteFirearm] = useMutation(REMOVE_FIREARM);

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
        heightFrontSight: firearmData.heightFrontSight,
        sightRadius: firearmData.sightRadius,
        notes: firearmData.notes,
        measureSystem: firearmData.measureSystem,
      },
    });
    return responseOnline;
  };

  const uploadChangedFirearmData = async (firearmData, id) => {
    // Write update to firearm data to MongoDB
    const responseOnline = await editFirearm({
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
        heightFrontSight: firearmData.heightFrontSight,
        heightRearSight: firearmData.heightRearSight,
        sightRadius: firearmData.sightRadius,
        notes: firearmData.notes,
        measureSystem: firearmData.measureSystem,
      },
    });
    return responseOnline;
  };

  const updateDeletedFirearmData = async (id) => {
    const responseOnline = await deleteFirearm({
      variables: {
        _id: id,
      },
    });
    return responseOnline;
  };

  useEffect(() => {
    const getData = async () => {
      const offlineFirearmArray = await firearmDataArray();
      if (offlineFirearmArray.lenghth !== 0) {
        for (let i = 0; i < offlineFirearmArray.length; i++) {
          if (offlineFirearmArray[i].operation === "ADD") {
            const offlineFirearmDataDocument = offlineFirearmArray[i];
            const responseOnline = await uploadNewFirearmData(
              offlineFirearmDataDocument
            );
            console.log("Response from database update of new firearm data");
            console.log(JSON.stringify(responseOnline));
            const deletionResponse = await db.firearms.delete(
              offlineFirearmDataDocument.id
            );
            console.log("Response from deletion of indexedDB record");
            console.log(deletionResponse);
            window.location.replace("/firearms");
          }

          if (offlineFirearmArray[i].operation === "EDIT") {
            const offlineFirearmDataDocument = offlineFirearmArray[i];
            const responseOnline = await uploadChangedFirearmData(
              offlineFirearmDataDocument,
              offlineFirearmDataDocument.id
            );
            console.log(
              "Response from database update of changed firearm data"
            );
            console.log(JSON.stringify(responseOnline));
            const deletionResponse = await db.firearms.delete(
              offlineFirearmDataDocument.id
            );
            console.log("Response from deletion of indexedDB record");
            console.log(deletionResponse);
            window.location.replace("/firearms");
          }

          if (offlineFirearmArray[i].operation === "DELETE") {
            const offlineFirearmDataDocument = offlineFirearmArray[i];
            const responseOnline = await updateDeletedFirearmData(
              offlineFirearmDataDocument.id
            );
            console.log(
              "Response from database update of deleted firearm data"
            );
            console.log(JSON.stringify(responseOnline));
            const deletionResponse = await db.firearms.delete(
              offlineFirearmDataDocument.id
            );
            console.log("Response from deletion of indexedDB record");
            console.log(deletionResponse);
            window.location.replace("/firearms");
          }
        }
      } else {
        setUpdateRequired(!updateRequired);
      }
    };

    getData();
  }, [updateRequired]);

  // Graphql query for a listing of all firearms - using skip parameter to avoid error when not logged in
  const { data } = useQuery(GET_ALL_FIREARMS, { skip: !loggedIn });

  useEffect(() => {
    const firearmsList = data?.firearmsByUser || [];
    setShowFirearms(firearmsList);
  }, [data]);

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
              <Link to={{ pathname: `/firearms/single/0` }}>
                <Button>Add Firearm</Button>
              </Link>
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
    </div>
  );
};

export default Firearms;

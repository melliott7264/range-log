import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_ALL_LOG_ENTRIES, GET_ALL_FIREARMS } from '../utils/queries';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';

import AuthService from '../utils/auth';

const Download = () => {
  // state to hold all log data
  const [showLogs, setShowLogs] = useState([]);
  const [showFirearms, setShowFirearms] = useState([]);

  const loggedIn = AuthService.loggedIn();

  // query ALL log data for authenticated user
  const { data: rawLogData } = useQuery(GET_ALL_LOG_ENTRIES, {
    skip: !loggedIn,
  });
  // Graphql query for a listing of all firearms - using skip parameter to avoid error when not logged in
  const { data: rawFirearmsData } = useQuery(GET_ALL_FIREARMS, {
    skip: !loggedIn,
  });

  useEffect(() => {
    const logData = rawLogData?.logsByUser || [];
    const adjustedLogData = logData.map((log) => {
      const logDataObj = { ...log };
      logDataObj.date = dayjs(parseInt(logDataObj.date)).format('YYYY-MM-DD');
      return logDataObj;
    });
    setShowLogs(adjustedLogData);
    const firearmsList = rawFirearmsData?.firearmsByUser || [];
    setShowFirearms(firearmsList);
  }, [rawLogData, rawFirearmsData]);

  // header definition to prepare an export of log data to a csv file
  const exportLogHeaders = [
    { label: 'ID', key: '_id' },
    { label: 'Date', key: 'date' },
    { label: 'Target', key: 'target' },
    { label: 'Shot', key: 'shot' },
    { label: 'Firearm ID', key: 'firearmId' },
    { label: 'Target Type', key: 'targetType' },
    { label: 'Target Distance', key: 'targetDistance' },
    { label: 'Shooting Position', key: 'shootingPosition' },
    { label: 'Metric', key: 'measureSystem' },
    { label: 'Temperature', key: 'temperature' },
    { label: 'Humidity', key: 'humidity' },
    { label: 'Wind Speed', key: 'windSpeed' },
    { label: 'Wind Direction', key: 'windDirection' },
    { label: 'Score Ring', key: 'scoreRing' },
    { label: 'Score X', key: 'scoreX' },
    { label: 'Score Orientation', key: 'scoreOrientation' },
    { label: 'Round Ball', key: 'projectileType' },
    { label: 'Projectile Diameter', key: 'projectileDiameter' },
    { label: 'Projectile Weight', key: 'projectileWeight' },
    { label: 'Patch Material', key: 'patchMaterial' },
    { label: 'Patch Thickness', key: 'patchThickness' },
    { label: 'Patch Lube', key: 'patchLube' },
    { label: 'Powder Brand', key: 'powderBrand' },
    { label: 'Powder Grade', key: 'powderGrade' },
    { label: 'Powder Lot', key: 'powderLot' },
    { label: 'Powder Charge', key: 'powderCharge' },
    { label: 'Notes', key: 'notes' },
  ];

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

  return (
    <>
      <Container>
        <Row>
          <div>
            <p>
              This function allows you to download ALL your log data into an
              Excel (.csv) spreadsheet. Click the "Download Logs" or "Download
              Firearms" links to proceed.
            </p>
          </div>
        </Row>
        <Row>
          <Col>
            {' '}
            <div className="text-center">
              <CSVLink
                data={showLogs}
                headers={exportLogHeaders}
                filename={'my_range_log.csv'}
                target="_blank"
              >
                Download Logs
              </CSVLink>
            </div>
          </Col>
          <Col>
            {' '}
            <div className="text-center">
              <CSVLink
                data={showFirearms}
                headers={exportFirearmsHeaders}
                filename={'my_firearms.csv'}
                target="_blank"
              >
                Download Firearms
              </CSVLink>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Download;

import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_ALL_LOG_ENTRIES } from '../utils/queries';
import { CSVLink } from 'react-csv';

import AuthService from '../utils/auth';

const Download = () => {
  // state to hold all log data
  const [showLogs, setShowLogs] = useState([]);

  const loggedIn = AuthService.loggedIn();

  // query ALL log data for authenticated user
  const { data } = useQuery(GET_ALL_LOG_ENTRIES, { skip: !loggedIn });

  useEffect(() => {
    const logData = data?.logsByUser || [];
    setShowLogs(logData);
  }, [data]);

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
  return (
    <>
      <div>
        <p>
          This function allows you to download ALL your log data into an Excel
          (.csv) spreadsheet. Click the "Download Excel Spreadsheet" link to
          proceed.
        </p>
      </div>
      <div className="text-center">
        <CSVLink
          data={showLogs}
          headers={exportLogHeaders}
          filename={'my_range_log.csv'}
          target="_blank"
        >
          Download Excel Spreadsheet{' '}
        </CSVLink>
      </div>
    </>
  );
};

export default Download;

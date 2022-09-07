import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_FIREARM } from '../utils/queries';
import { useParams } from 'react-router-dom';

import AuthService from '../utils/auth';

const SingleFirearm = () => {
  const { id } = useParams();

  const loggedIn = AuthService.loggedIn();

  const [firearmData, setFirearmData] = useState({});
  const { data } = useQuery(
    GET_FIREARM,
    {
      variables: { _id: id },
    },
    { skip: !loggedIn }
  );

  useEffect(() => {
    const firearm = data?.firearm[0] || {};
    setFirearmData(firearm);
  }, [data]);

  return (
    <div>
      <div className="text-center">
        <h3>Firearm Description</h3>
      </div>
      <div className="text-center">
        <p>Name: {firearmData.name}</p>
        <p>Ignition Type: {firearmData.ignitionType}</p>
        <p>Barrel Length: {firearmData.barrelLength}</p>
        <p>Caliber: {firearmData.caliber}</p>
      </div>
    </div>
  );
};

export default SingleFirearm;

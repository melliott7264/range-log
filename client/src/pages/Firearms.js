import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_FIREARMS } from '../utils/queries';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AuthService from '../utils/auth';

const Firearms = () => {
  // state to show listing of user firearms from which to select
  const [showFirearms, setShowFirearms] = useState([]);
  const loggedIn = AuthService.loggedIn();

  const { data } = useQuery(GET_ALL_FIREARMS, { skip: !loggedIn });

  useEffect(() => {
    const firearmsList = data?.firearmsByUser || [];
    setShowFirearms(firearmsList);
  }, [data]);

  return (
    <div>
      <div className="container ">
        <div className="row">
          <div className="text-center">
            <h3>Firearms</h3>
          </div>
          <span className="text-center">
            <Button className="btn p-1 text-white">Add Firearm</Button>
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
  );
};

export default Firearms;

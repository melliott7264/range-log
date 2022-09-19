import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { LOG_TARGETS } from '../utils/queries';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import AuthService from '../utils/auth';
import { unique } from '../utils/utils';

const Targets = () => {
  const { date } = useParams();

  const [showTargets, setShowTargets] = useState();

  const loggedIn = AuthService.loggedIn();

  const { loading, error, data } = useQuery(
    LOG_TARGETS,
    { variables: { date: date } },
    { skip: !loggedIn }
  );

  useEffect(() => {
    const targetsList = data?.logTargetsByDate || [];
    setShowTargets(targetsList);
  }, [data]);

  // define the target array to be filtered for unique targets
  const targetArray = [];

  // conditonal is required to make sure query data exists
  if (data)
    // creating an array of only targets to list and pass to unique function
    for (let i = 0; i < showTargets.length; i++) {
      targetArray.push(showTargets[i].target);
    }

  // function to return a array with only unique targets
  const uniqueTargets = unique(targetArray);

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (error) {
    return <h4>There was a loading error... {error.message}</h4>;
  }

  return (
    <>
      <div>
        <h3 className="text-center">Range Session</h3>
        <Link to={{ pathname: `/logs/targets/${date}` }}>
          <p className="text-center">{date}</p>
        </Link>
        <h4 className="text-center">Targets</h4>
      </div>
      <ul className="list-group">
        {uniqueTargets.map((target) => (
          <li key={target} className="list-group-item">
            <div className="row">
              <div className="col-md-12">
                <Link
                  to={{ pathname: `/logs/targets/shots/${date}&${target}` }}
                >
                  <h4 className="text-center">{target}</h4>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Targets;

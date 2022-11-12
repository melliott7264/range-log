import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { LOG_TARGETS } from '../utils/queries';
import { ADD_LOG_ENTRY } from '../utils/mutations';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import dayjs from 'dayjs';
import AuthService from '../utils/auth';
import { unique } from '../utils/utils';

const Targets = () => {
  const { date } = useParams();

  const [showTargets, setShowTargets] = useState();

  const loggedIn = AuthService.loggedIn();
  if (!loggedIn) {
    window.location.replace('/');
  }

  const { loading, error, data } = useQuery(
    LOG_TARGETS,
    { variables: { date: date } },
    { skip: !loggedIn }
  );

  // Graphql mutation to setup callback function to add a log entry
  const [addTarget] = useMutation(ADD_LOG_ENTRY);

  useEffect(() => {
    const targetsList = data?.logTargetsByDate || [];
    setShowTargets(targetsList);
  }, [data]);

  // define the target array to be filtered for unique targets
  const targetArray = [];

  // conditonal is required to make sure query data exists
  if (showTargets)
    // creating an array of only targets to list and pass to unique function
    for (let i = 0; i < showTargets.length; i++) {
      targetArray.push(showTargets[i].target);
    }

  // function to return a array with only unique targets
  const uniqueTargets = unique(targetArray);

  // routine to add a new log entry for a new target for current date
  const handleAddLogEntry = async (event) => {
    try {
      const response = await addTarget({
        variables: {
          firearmId: showTargets[0].firearmId,
          date: date,
          target: Math.max(...uniqueTargets) + 1,
          shot: 1,
        },
      });
      console.log(response);
      window.location.replace(`/logs/targets/${date}`);
    } catch (err) {
      console.log(err);
    }
  };

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
          <p className="text-center">
            {dayjs(parseInt(date)).format('YYYY-MM-DD')}
          </p>
        </Link>
        <h4 className="text-center">Targets</h4>
      </div>
      <div className="text-center">
        <Button className="btn p-1 text-white" onClick={handleAddLogEntry}>
          Add Target
        </Button>
      </div>
      <ul className="list-group">
        {uniqueTargets.map((target) => (
          <li key={target} className="list-group-item">
            <div className="row">
              <div className="col-md-12">
                <Link
                  to={{
                    pathname: `/logs/targets/shots/${date}&${target}&${uniqueTargets.length}`,
                  }}
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

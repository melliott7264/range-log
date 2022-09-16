import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { LOG_DATES } from '../utils/queries';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

import AuthService from '../utils/auth';

const Logs = () => {
  // state to show logs by dates
  const [showDates, setShowDates] = useState();

  const loggedIn = AuthService.loggedIn();

  // Graphql query for listing of all log dates
  const { loading, error, data } = useQuery(LOG_DATES, { skip: !loggedIn });

  useEffect(() => {
    const datesList = data?.logDates || [];
    setShowDates(datesList);
  }, [data, showDates]);

  if (loading) {
    return <h4>Loading...</h4>;
  }

  // if (error) {
  //   return <h4>There was a loading error... {error}</h4>;
  // }

  return (
    <>
      <ul className="list-group">
        {showDates.map((date) => (
          <li key={date._id} className="list-group-item">
            <div className="row">
              <div className="col-md-12">
                <Link to={{ pathname: `/logs/targets/${date.date}` }}>
                  <h4>{dayjs(date.date).format('YYYY-MM-DD')}</h4>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Logs;

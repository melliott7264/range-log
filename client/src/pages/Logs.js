import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { LOG_DATES } from '../utils/queries';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { unique } from '../utils/utils';

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
  }, [data]);

  // define a date array to be filtered for unique range sessions
  const dateArray = [];

  // conditional is required to make sure query data exists in order to proceed
  if (data) {
    // creating an array of only dates to list and pass to unique function to remove duplicates
    for (let i = 0; i < showDates.length; i++) {
      dateArray.push(showDates[i].date);
    }
  }

  // function unique returns an array with only unique elements
  const uniqueDates = unique(dateArray);

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (error) {
    return <h4>There was a loading error... {error.message}</h4>;
  }

  return (
    <>
      <div>
        <h3 className="text-center">Range Sessions</h3>
      </div>
      <ul className="list-group">
        {uniqueDates.map((date) => (
          <li key={date} className="list-group-item">
            <div className="row">
              <div className="col-md-12">
                <Link to={{ pathname: `/logs/targets/${date}` }}>
                  <p className="text-center">{date}</p>
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

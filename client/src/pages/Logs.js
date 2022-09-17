import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { LOG_DATES } from '../utils/queries';
import { Link } from 'react-router-dom';
import { dayjs } from 'dayjs';
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

  const dateArray = [];

  for (let i = 0; i < showDates.length; i++) {
    dateArray.push(showDates[i].date);
  }

  const uniqueDates = unique(dateArray);
  console.log(uniqueDates);

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (error) {
    return <h4>There was a loading error... {error.message}</h4>;
  }

  return (
    <>
      <ul className="list-group">
        {uniqueDates.map((date) => (
          <li key={date.date} className="list-group-item">
            <div className="row">
              <div className="col-md-12">
                <Link to={{ pathname: `/logs/targets/${date}` }}>
                  <h4>{dayjs(date.date).format('YYYY-MM-DD')}</h4>
                  {/* <h4>{date.date}</h4> */}
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

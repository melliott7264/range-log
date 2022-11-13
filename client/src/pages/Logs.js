import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_FIREARMS, LOG_DATES } from '../utils/queries';
import { ADD_LOG_ENTRY } from '../utils/mutations';
import { Link } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import { unique } from '../utils/utils';

import AuthService from '../utils/auth';

const Logs = () => {
  // state to show logs by dates
  const [showDates, setShowDates] = useState();
  // state controlling modal to add a new session
  const [showModal, setShowModal] = useState(false);
  // state controlling selected firearm
  // const [showFirearm, setShowFirearm] = useState();
  // state controlling firearm listing
  const [showFirearms, setShowFirearms] = useState();

  const loggedIn = AuthService.loggedIn();

  // define variable for entire component
  let selectedFirearm = '';

  // Graphql query for listing of all log dates
  const { loading, error, data } = useQuery(LOG_DATES, { skip: !loggedIn });

  // Graphql query to get all firearms for selection for session creation
  const { data: firearms } = useQuery(GET_ALL_FIREARMS, { skip: !loggedIn });

  // Graphql mutation to setup callback function to add a log entry
  const [addSession] = useMutation(ADD_LOG_ENTRY);

  useEffect(() => {
    const datesList = data?.logDates || [];
    setShowDates(datesList);
    const firearmsList = firearms?.firearmsByUser || [];
    setShowFirearms(firearmsList);
  }, [data, firearms]);

  // define a date array to be filtered for unique range sessions
  const dateArray = [];

  // conditional is required to make sure query data exists in order to proceed
  if (data && firearms) {
    // creating an array of only dates to list and pass to unique function to remove duplicates
    for (let i = 0; i < showDates.length; i++) {
      dateArray.push(showDates[i].date);
    }
  }

  // function unique returns an array with only unique elements
  const uniqueDates = unique(dateArray);

  // sort session dates in decending order
  const sortedSessions = uniqueDates.sort(function (a, b) {
    return b - a;
  });

  // routine to add a new log entry for current date
  const handleAddLogEntry = async (event) => {
    event.preventDefault();
    try {
      const response = await addSession({
        variables: {
          firearmId: selectedFirearm,
          date: dayjs(),
          target: 1,
          shot: 1,
        },
      });
      console.log(response);
      window.location.replace('/logs');
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectFirearm = (event) => {
    selectedFirearm = event.target.value;
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
        <div className="container">
          <div className="row">
            <div className="text-center">
              <h3>Range Sessions</h3>
            </div>
            <span className="text-center">
              <Button
                className="btn p-1 text-white"
                onClick={() => setShowModal(true)}
              >
                Add Session
              </Button>
            </span>
          </div>
        </div>
      </div>

      <ul className="list-group">
        {sortedSessions.map((date) => (
          <li key={date} className="list-group-item">
            <div className="row">
              <div className="col-md-12">
                <Link to={{ pathname: `/logs/targets/${date}` }}>
                  <p className="text-center">
                    {dayjs(parseInt(date)).format('YYYY-MM-DD')}
                  </p>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        size="md"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="add-session-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-session-modal">
            <h4>Add New Range Session for Today</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddLogEntry}>
            <Form.Select
              aria-label="Select from list of firearms"
              custom
              onChange={handleSelectFirearm}
            >
              <option>Select the firearm for this session</option>
              {showFirearms?.map((firearm) => (
                <option key={firearm._id} value={firearm._id}>
                  {firearm.name}
                </option>
              ))}
            </Form.Select>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Logs;

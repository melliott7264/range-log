import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { LOG_TARGETS } from '../utils/queries';
import { ADD_LOG_ENTRY } from '../utils/mutations';
import { Link } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import AuthService from '../utils/auth';
import { unique } from '../utils/utils';

const Targets = () => {
  const { date } = useParams();
  // state controlling modal to add a new session
  const [showModal, setShowModal] = useState(false);
  // state controlling firearm listing
  const [showFirearms, setShowFirearms] = useState();

  const [showTargets, setShowTargets] = useState();

  const loggedIn = AuthService.loggedIn();

  // define variable for entire component
  let selectedFirearm = '';

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
  if (data)
    // creating an array of only targets to list and pass to unique function
    for (let i = 0; i < showTargets.length; i++) {
      targetArray.push(showTargets[i].target);
    }

  // function to return a array with only unique targets
  const uniqueTargets = unique(targetArray);

  // routine to add a new log entry for current date
  const handleAddLogEntry = async (event) => {
    try {
      const response = await addTarget({
        variables: {
          firearmId: selectedFirearm,
          date: dayjs(),
          target: 1,
          shot: 1,
        },
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectFirearm = (event) => {
    selectedFirearm = event.target.value;
    console.log(selectedFirearm);
    // setShowFirearm(event.target.value);
    // console.log(showFirearm);
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
      <span className="text-center">
        <Button
          className="btn p-1 text-white"
          // onClick={() => setShowModal(true)}
        >
          Add Target
        </Button>
      </span>
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

export default Targets;

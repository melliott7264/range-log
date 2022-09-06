import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_FIREARMS } from '../utils/queries';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Firearms = () => {
  // state to show listing of user firearms from which to select
  const [showFirearms, setShowFirearms] = useState([]);

  const { data } = useQuery(GET_ALL_FIREARMS);
  console.log(data);

  useEffect(() => {
    const firearmsList = data?.firearmsByUser || [];
    console.log(firearmsList);
    setShowFirearms(firearmsList);
  }, [data]);

  return (
    <div>
      <div className="text-center">
        <h3>Firearms</h3>
      </div>
      <ul className="list-group">
        {showFirearms.map((firearm) => (
          <li key={firearm._id} className="list-group-item">
            <div className="row">
              <div className="col-md-12">
                <Nav.Link
                  as={Link}
                  to={{ pathname: `/firearms/single/${firearm._id}` }}
                >
                  <p>{firearm.name}</p>
                </Nav.Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Firearms;

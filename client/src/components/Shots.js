import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { LOG_SHOTS } from '../utils/queries';
import { ADD_LOG_ENTRY } from '../utils/mutations';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import AuthService from '../utils/auth';

const Shots = () => {
  const { date, target } = useParams();
  const targetNumber = parseInt(target);

  const [showShots, setShowShots] = useState();

  const loggedIn = AuthService.loggedIn();

  const { loading, error, data } = useQuery(
    LOG_SHOTS,
    { variables: { date: date, target: targetNumber } },
    { skip: !loggedIn }
  );

  const [addLogEntry] = useMutation(ADD_LOG_ENTRY);

  useEffect(() => {
    const shotList = data?.logShotsByTargetDate || [];
    setShowShots(shotList);
  }, [data]);

  console.log(showShots);

  // routine to add a log entry
  const handleAddLogEntry = async () => {
    try {
      const response = await addLogEntry({
        variables: {
          date: date,
          target: targetNumber,
          //   shot: shotNumber,
          //   firearmId: firearmId,
          //   measureSystem: showShot.measureSystem,
          //   temperature: showShot.temperature,
          //   humidity: showShot.humidity,
          //   windSpeed: showShot.windSpeed,
          //   windDirection: showShot.windDirection,
          //   scoreRing: showShot.scoreRing,
          //   scoreX: showShot.scoreX,
          //   scoreOrientation: showShot.scoreOrientation,
          //   projectileType: showShot.projectileType,
          //   projectileDiameter: showShot.projectileDiameter,
          //   projectileWeight: showShot.projectileWeight,
          //   patchMaterial: showShot.patchMaterial,
          //   patchThickness: showShot.patchThickness,
          //   patchLube: showShot.patchLube,
          //   powderBrand: showShot.powderBrand,
          //   powderGrade: showShot.powderGrade,
          //   powderLot: showShot.powderLot,
          //   powderCharge: showShot.powderCharge,
        },
      });
      console.log(response);
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
          <p className="text-center">{date}</p>
        </Link>
        <div className="text-center">
          <h4 className="d-inline-block">Target</h4>
          <Link to={{ pathname: `/logs/targets/shots/${date}&${target}` }}>
            <span className="m-2 float-right">{targetNumber}</span>
          </Link>
        </div>
        <h5 className="text-center">Shots</h5>
      </div>
      <ul className="list-group">
        {showShots.map((shot) => (
          <li key={shot.shot} className="list-group-item">
            <div className="row">
              <div className="col-md-12">
                <Link
                  to={{
                    pathname: `/logs/targets/shots/shot/${date}&${target}&${shot.shot}&${shot.firearmId}`,
                  }}
                >
                  <p className="text-center">{shot.shot}</p>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Shots;

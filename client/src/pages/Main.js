import React from 'react';

import AuthService from '../utils/auth';

const Main = () => {
  const loggedIn = AuthService.loggedIn();

  return (
    <div>
      <h3 className="text-center">Welcome to Muzzleloader Range Log</h3>
      {!loggedIn ? (
        <div>
          <h4 className="text-center">Please Signup or Login</h4>
          <p className="text-center">
            After logging in, more instructions will be provided.
          </p>
        </div>
      ) : (
        <div>
          <p>
            If you are new to Muzzleloader Range Log, you will want to start by
            clicking on Firearms to add one or more firearms that you will log.
          </p>
          <p>
            Once your firearm is in the system, you can start logging your
            shots. Click on Logs to get started. You will create a target and
            then log shots on that target.
          </p>
        </div>
      )}
    </div>
  );
};

export default Main;

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { LOG_DATES } from '../utils/queries';
import { Link } from 'react-router-dom';

import AuthService from '../utils/auth';

const Logs = () => {
  // state to show logs by dates
  const [showDates, setShowDates] = useState();

  const loggedIn = AuthService.loggedIn();

  // Graphql query for listing of all log dates
  const { dates } = useQuery(LOG_DATES);
};

export default Logs;

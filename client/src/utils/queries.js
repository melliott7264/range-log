import { gql } from '@apollo/client';

// Query ALL users for testing only
export const GET_ALL_USERS = gql`
  query users {
    users {
      _id
      firstName
      lastName
      email
    }
  }
`;

// Query logged-in user data
export const GET_ME = gql`
  query me {
    me {
      _id
      firstName
      lastName
      email
    }
  }
`;

// Query all firearms by logged in user through context
export const GET_ALL_FIREARMS = gql`
  query firearmsByUser {
    firearmsByUser {
      _id
      name
      measureSystem
      barrelLength
      caliber
      ignitionType
      diaTouchHole
      diaRearSight
      diaFrontSight
      heightRearSight
      heightFrontSight
      sightRadius
      userId
    }
  }
`;

export const GET_FIREARM = gql`
  query firearm($_id: ID!) {
    firearm(_id: $_id) {
      _id
      name
      measureSystem
      barrelLength
      caliber
      ignitionType
      diaTouchHole
      diaRearSight
      diaFrontSight
      heightRearSight
      heightFrontSight
      sightRadius
      userId
    }
  }
`;

// Query all log entries for the logged in user
export const GET_ALL_LOG_ENTRIES = gql`
  query logsByUser {
    logsByUser {
      _id
      userId
      date
      target
      shot
      firearmId
      measureSystem
      temperature
      humidity
      windSpeed
      windDirection
      scoreRing
      scoreX
      scoreOrientation
      projectileType
      projectileDiameter
      projectileWeight
      patchMaterial
      patchThickness
      patchLube
      powderBrand
      powderGrade
      powderLot
      powderCharge
    }
  }
`;

// Query all log entries for the logged in user and a specifed date
export const GET_LOG_ENTRIES_BY_DATE = gql`
  query logsByDate($date: String!) {
    logsByDate(date: $date) {
      _id
      userId
      date
      target
      shot
      firearmId
      measureSystem
      temperature
      humidity
      windSpeed
      windDirection
      scoreRing
      scoreX
      scoreOrientation
      projectileType
      projectileDiameter
      projectileWeight
      patchMaterial
      patchThickness
      patchLube
      powderBrand
      powderGrade
      powderLot
      powderCharge
    }
  }
`;

// Query all log entries for the logged in user and a specifed date
export const GET_LOG_ENTRIES_BY_TARGET = gql`
  query logsByTarget($date: String!, $target: Int!) {
    logsByTarget(date: $date, target: $target) {
      _id
      userId
      date
      target
      shot
      firearmId
      measureSystem
      temperature
      humidity
      windSpeed
      windDirection
      scoreRing
      scoreX
      scoreOrientation
      projectileType
      projectileDiameter
      projectileWeight
      patchMaterial
      patchThickness
      patchLube
      powderBrand
      powderGrade
      powderLot
      powderCharge
    }
  }
`;

// Query all log entries for the logged in user and a specifed date
export const GET_LOG_ENTRIES_BY_SHOT = gql`
  query logsByShot($date: String!, $target: Int!, $shot: Int!) {
    logsByShot(date: $date, target: $target, shot: $shot) {
      _id
      userId
      date
      target
      shot
      firearmId
      measureSystem
      temperature
      humidity
      windSpeed
      windDirection
      scoreRing
      scoreX
      scoreOrientation
      projectileType
      projectileDiameter
      projectileWeight
      patchMaterial
      patchThickness
      patchLube
      powderBrand
      powderGrade
      powderLot
      powderCharge
    }
  }
`;

export const LOG_DATES = gql`
  query logDates {
    logDates {
      date
    }
  }
`;

export const LOG_TARGETS = gql`
  query logTargetsByDate($date: String!) {
    logTargetsByDate(date: $date) {
      target
    }
  }
`;

export const LOG_SHOTS = gql`
  query logShotsByTargetDate($date: String!, $target: Int!) {
    logShotsByTargetDate(date: $date, target: $target) {
      shot
      firearmId
    }
  }
`;

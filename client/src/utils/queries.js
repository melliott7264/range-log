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

// Query all log entries for the logged in user
export const GET_ALL_LOG_ENTRIES = gql`
  query logsByUser {
    logsByUser {
      _id
      userId
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
  query logsByTarget($date: String!, $target: Int!, $shot: Int!) {
    logsByTarget(date: $date, target: $target, shot: $shot) {
      _id
      userId
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

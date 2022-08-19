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

import { gql } from '@apollo/client';

// Variables must match variables used in callback function in components and pages.
// Property names must match resolvers on back-end
// Arguments must match typeDefs on back-end

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;

export const ADD_FIREARM = gql`
  mutation addFirearm(
    $name: String!
    $measureSystem: Boolean
    $barrelLength: Int
    $caliber: Float
    $ignitionType: String
    $diaTouchHole: Float
    $diaRearSight: Float
    $diaFrontSight: Float
    $heightRearSight: Float
    $heightFrontSight: Float
    $sightRadius: Float
  ) {
    addFirearm(
      name: $name
      measureSystem: $measureSystem
      barrelLength: $barrelLength
      caliber: $caliber
      ignitionType: $ignitionType
      diaTouchHole: $diaTouchHole
      diaRearSight: $diaRearSight
      diaFrontSight: $diaFrontSight
      heightRearSight: $heightRearSight
      heightFrontSight: $heightFrontSight
      sightRadius: $sightRadius
    ) {
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

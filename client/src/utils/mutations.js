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
    $distanceToTarget: Int
    $muzzleVelocity: Int
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
      distanceToTarget: $distanceToTarget
      muzzleVelocity: $muzzleVelocity
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
      distanceToTarget
      muzzleVelocity
      diaRearSight
      diaFrontSight
      heightRearSight
      heightFrontSight
      sightRadius
      userId
    }
  }
`;

export const EDIT_FIREARM = gql`
  mutation editFirearm(
    $_id: ID!
    $name: String
    $measureSystem: Boolean
    $barrelLength: Int
    $caliber: Float
    $ignitionType: String
    $diaTouchHole: Float
    $distanceToTarget: Int
    $muzzleVelocity: Int
    $diaRearSight: Float
    $diaFrontSight: Float
    $heightRearSight: Float
    $heightFrontSight: Float
    $sightRadius: Float
  ) {
    editFirearm(
      _id: $_id
      name: $name
      measureSystem: $measureSystem
      barrelLength: $barrelLength
      caliber: $caliber
      ignitionType: $ignitionType
      diaTouchHole: $diaTouchHole
      distanceToTarget: $distanceToTarget
      muzzleVelocity: $muzzleVelocity
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
      distanceToTarget
      muzzleVelocity
      diaRearSight
      diaFrontSight
      heightRearSight
      heightFrontSight
      sightRadius
      userId
    }
  }
`;

export const ADD_LOG_ENTRY = gql`
  mutation addLogEntry(
    $date: String!
    $target: Int!
    $shot: Int!
    $firearmId: ID!
    $measureSystem: Boolean
    $temperature: Int
    $humidity: Int
    $windSpeed: Int
    $windDirection: String
    $scoreRing: Int
    $scoreX: Boolean
    $scoreOrientation: Int
    $projectileType: Boolean
    $projectileDiameter: Float
    $projectileWeight: Float
    $patchMaterial: String
    $patchThickness: Float
    $patchLube: String
    $powderBrand: String
    $powderGrade: String
    $powderLot: String
    $powderCharge: Int
  ) {
    addLogEntry(
      date: $date
      target: $target
      shot: $shot
      firearmId: $firearmId
      measureSystem: $measureSystem
      temperature: $temperature
      humidity: $humidity
      windSpeed: $windSpeed
      windDirection: $windDirection
      scoreRing: $scoreRing
      scoreX: $scoreX
      scoreOrientation: $scoreOrientation
      projectileType: $projectileType
      projectileDiameter: $projectileDiameter
      projectileWeight: $projectileWeight
      patchMaterial: $patchMaterial
      patchThickness: $patchThickness
      patchLube: $patchLube
      powderBrand: $powderBrand
      powderGrade: $powderGrade
      powderLot: $powderLot
      powderCharge: $powderCharge
    ) {
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

export const EDIT_LOG_ENTRY = gql`
  mutation editLogEntry(
    $_id: ID!
    $date: String
    $target: Int
    $shot: Int
    $firearmId: ID
    $measureSystem: Boolean
    $temperature: Int
    $humidity: Int
    $windSpeed: Int
    $windDirection: String
    $scoreRing: Int
    $scoreX: Boolean
    $scoreOrientation: Int
    $projectileType: Boolean
    $projectileDiameter: Float
    $projectileWeight: Float
    $patchMaterial: String
    $patchThickness: Float
    $patchLube: String
    $powderBrand: String
    $powderGrade: String
    $powderLot: String
    $powderCharge: Int
  ) {
    editLogEntry(
      _id: $_id
      date: $date
      target: $target
      shot: $shot
      firearmId: $firearmId
      measureSystem: $measureSystem
      temperature: $temperature
      humidity: $humidity
      windSpeed: $windSpeed
      windDirection: $windDirection
      scoreRing: $scoreRing
      scoreX: $scoreX
      scoreOrientation: $scoreOrientation
      projectileType: $projectileType
      projectileDiameter: $projectileDiameter
      projectileWeight: $projectileWeight
      patchMaterial: $patchMaterial
      patchThickness: $patchThickness
      patchLube: $patchLube
      powderBrand: $powderBrand
      powderGrade: $powderGrade
      powderLot: $powderLot
      powderCharge: $powderCharge
    ) {
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

export const REMOVE_FIREARM = gql`
  mutation removeFirearm($_id: ID!) {
    removeFirearm(_id: $_id) {
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

export const REMOVE_LOG_ENTRY = gql`
  mutation removeLogEntry($_id: ID!) {
    removeLogEntry(_id: $_id) {
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

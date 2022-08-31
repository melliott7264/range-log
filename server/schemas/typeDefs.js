const { gql } = require('apollo-server-express');

// Mutation names and arguments (including types) must match contents of mutations file on front-end

// Note that all queries are by logged-in user
const typeDefs = gql`
  type Query {
    users: [User]
    firearmsByUser: [Firearm]
    firearm(firearmId: ID!): Firearm
    logsByUser: [Log]
    logsByDate(date: String!): [Log]
    logsByTarget(date: String!, target: Int!): [Log]
    logsByShot(date: String!, target: Int!, shot: Int!): [Log]
    logDates: [Log]
    logTargetsByDate(date: String!): [Log]
    logShotsByTargetDate(date: String!, target: Int!): [Log]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Auth
    addFirearm(
      name: String!
      measureSystem: Boolean
      barrelLength: Int
      caliber: Float
      ignitionType: String
      diaTouchHole: Float
      diaRearSight: Float
      diaFrontSight: Float
      heightRearSight: Float
      heightFrontSight: Float
      sightRadius: Float
    ): Firearm
    addLogEntry(
      date: String!
      target: Int!
      shot: Int!
      firearmId: ID!
      measureSystem: Boolean
      temperature: Int
      humidity: Int
      windSpeed: Int
      windDirection: String
      scoreRing: Int
      scoreX: Boolean
      scoreOrientation: Int
      projectileType: Boolean
      projectileDiameter: Float
      projectileWeight: Float
      patchMaterial: String
      patchThickness: Float
      patchLube: String
      powderBrand: String
      powderGrade: String
      powderLot: String
      powderCharge: Int
    ): Log
    editFirearm(
      _id: ID!
      name: String
      measureSystem: Boolean
      barrelLength: Int
      caliber: Float
      ignitionType: String
      diaTouchHole: Float
      diaRearSight: Float
      diaFrontSight: Float
      heightRearSight: Float
      heightFrontSight: Float
      sightRadius: Float
    ): Firearm
    editLogEntry(
      _id: ID!
      date: String
      target: Int
      shot: Int
      firearmId: ID
      measureSystem: Boolean
      temperature: Int
      humidity: Int
      windSpeed: Int
      windDirection: String
      scoreRing: Int
      scoreX: Boolean
      scoreOrientation: Int
      projectileType: Boolean
      projectileDiameter: Float
      projectileWeight: Float
      patchMaterial: String
      patchThickness: Float
      patchLube: String
      powderBrand: String
      powderGrade: String
      powderLot: String
      powderCharge: Int
    ): Log
    removeFirearm(_id: ID!): Firearm
    removeLogEntry(_id: ID!): Log
  }

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
  }

  type Firearm {
    _id: ID
    name: String
    measureSystem: Boolean
    barrelLength: Int
    caliber: Float
    ignitionType: String
    diaTouchHole: Float
    diaRearSight: Float
    diaFrontSight: Float
    heightRearSight: Float
    heightFrontSight: Float
    sightRadius: Float
    userId: ID
  }

  type Log {
    _id: ID
    userId: ID
    date: String
    target: Int
    shot: Int
    firearmId: ID
    measureSystem: Boolean
    temperature: Int
    humidity: Int
    windSpeed: Int
    windDirection: String
    scoreRing: Int
    scoreX: Boolean
    scoreOrientation: Int
    projectileType: Boolean
    projectileDiameter: Float
    projectileWeight: Float
    patchMaterial: String
    patchThickness: Float
    patchLube: String
    powderBrand: String
    powderGrade: String
    powderLot: String
    powderCharge: Int
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;

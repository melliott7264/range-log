const { gql } = require('apollo-server-express');

// Mutation names and arguments (including types) must match contents of mutations file on front-end

const typeDefs = gql`
  type Query {
    users: [User]
    firearmsByUser(userId: ID!): [Firearm]
    firearm(userId: ID!, firearmId: ID!): Firearm
    logsByUser(userId: ID!): [Log]
    logsByDate(userId: ID!, date: String!): [Log]
    logsByTarget(userId: ID!, date: String!, target: Int!): [Log]
    logByShot(userId: ID!, data: String!, target: Int!, shot: Int!): Log
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addFirearm(
      userID: ID!
      name: String!
      measureSystem: Boolean
      barrelLength: Int
      caliber: Float
      ignitionType: String
      diaTouchHole: Float
      diaRearSight: Float
      diaFrontSight: Float
      heightReadSight: Float
      heightFrontSight: Float
      sightRadius: Float
      ): Firearm
    addLogEntry(
      userId: ID!
      date: String!
      target: Int!
      shot: Int!
      firearm: ID!
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
      projectile Weight: Float
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
      heightReadSight: Float
      heightFrontSight: Float
      sightRadius: Float
      ): Firearm
    editLogEntry(
      _id: ID!
      firearm: ID
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
      projectile Weight: Float
      patchMaterial: String
      patchThickness: Float
      patchLube: String
      powderBrand: String
      powderGrade: String
      powderLot: String
      powderCharge: Int
      ): Log
      removeFirearm(_id: ID!)
      removeLogEntry(_id: ID!)
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
    firearmID: ID
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

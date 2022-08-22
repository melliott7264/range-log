const { AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');
const Firearm = require('../models/Firearm');
const Log = require('../models/Log');

const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // return all the users - for testing only!
    users: async (parent, args, context) => {
      const userData = await User.find({});
      return userData;
    },
    firearmsByUser: async (parent, args, context) => {
      if (context.user) {
        const firearms = await Firearm.find({ userId: context.user._id });
        return firearms;
      }
      throw new AuthenticationError('Not Logged In');
    },
    logsByUser: async (parent, args, context) => {
      if (context.user) {
        const logEntry = await Log.find({ userId: context.user_id });
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },
    logsByDate: async (parent, { date }, context) => {
      if (context.user) {
        const logEntry = await Log.find(
          $and[({ userId: context.user_id }, { date: date })]
        );
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },
    logsbyTarget: async (parent, { date, target }, context) => {
      if (context.user) {
        const logEntry = await Log.find(
          $and[
            ({ userId: context.user_id }, { date: date }, { target: target })
          ]
        );
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },
    logsbyShot: async (parent, { date, target, shot }, context) => {
      if (context.user) {
        const logEntry = await Log.find(
          $and[
            ({ userId: context.user_id },
            { date: date },
            { target: target },
            { shot: shot })
          ]
        );
        return logEntry;
      }
      throw new AuthenticationError('Not Logged In');
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    addFirearm: async (
      parent,
      {
        name,
        measureSystem,
        barrelLength,
        caliber,
        ignitionType,
        diaTouchHole,
        diaRearSight,
        diaFrontSight,
        heightRearSight,
        heightFrontSight,
        sightRadius,
      },
      context
    ) => {
      if (context.user) {
        const firearm = await Firearm.create({
          userId: context.user._id,
          name: name,
          measureSystem: measureSystem,
          barrelLength: barrelLength,
          caliber: caliber,
          ignitionType: ignitionType,
          diaTouchHole: diaTouchHole,
          diaRearSight: diaRearSight,
          diaFrontSight: diaFrontSight,
          heightRearSight: heightRearSight,
          heightFrontSight: heightFrontSight,
          sightRadius: sightRadius,
        });
        return firearm;
      }
      throw new AuthenticationError('Not Logged In');
    },
    addLogEntry: async (
      parent,
      {
        target,
        shot,
        firearmId,
        measureSystem,
        temperature,
        humidity,
        windSpeed,
        windDirection,
        scoreRign,
        scoreX,
        scoreOrientation,
        projectileType,
        projectileDiameter,
        projectileWeight,
        patchMaterial,
        patchThickness,
        patchLube,
        powderBrand,
        powderGrade,
        powderLot,
        powderCharge,
      },
      context
    ) => {
      if (context.user) {
        const logEntry = await Log.create({
          userId: context.user_id,
          date: new Date(),
          target: target,
          shot: shot,
          firearmId: firearmId,
          measureSystem: measureSystem,
          temperature: temperature,
          humidity: humidity,
          windSpeed: windSpeed,
          windDirection: windDirection,
          scoreRing: scoreRing,
          scoreX: scoreX,
          scoreOrientation: scoreOrientation,
          projectileType: projectileType,
          projectileDiameter: projectileDiameter,
          projectileWeight: projectileWeight,
          patchmaterial: patchMaterial,
          patchThickness: patchThickness,
          patchLube: patchLube,
          powderBrand: powderBrand,
          powderGrade: powderGrade,
          powderLot: powderLot,
          powderCharge: powderCharge,
        });
      }
      throw new AuthenticationErrow('Not Logged In');
    },
  },
};

module.exports = resolvers;

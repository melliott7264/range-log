const { AuthenticationError } = require('apollo-server-express');
const { User, Firearm, Log } = require('../models');

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
  },
};

module.exports = resolvers;

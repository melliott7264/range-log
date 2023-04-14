import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ADD_FIREARM, EDIT_FIREARM, REMOVE_FIREARM } from "../utils/mutations";

const [addFirearm] = useMutation(ADD_FIREARM);

  const [editFirearm] = useMutation(EDIT_FIREARM);

  const [deleteFirearm] = useMutation(REMOVE_FIREARM);

  const uploadNewFirearmData = async (firearmData) => {
    // Write new firearm data to MongoDB
    const responseOnline = await addFirearm({
      variables: {
        name: firearmData.name,
        ignitionType: firearmData.ignitionType,
        barrelLength: firearmData.barrelLength,
        caliber: firearmData.caliber,
        diaTouchHole: firearmData.diaTouchHole,
        distanceToTarget: firearmData.distanceToTarget,
        muzzleVelocity: firearmData.muzzleVelocity,
        diaRearSight: firearmData.diaRearSight,
        diaFrontSight: firearmData.diaFrontSight,
        heightRearSight: firearmData.heightRearSight,
        heightFrontSight: firearmData.heightFrontSight,
        sightRadius: firearmData.sightRadius,
        notes: firearmData.notes,
        measureSystem: firearmData.measureSystem,
      },
    });
    return responseOnline;
  };

  const uploadChangedFirearmData = async (firearmData, id) => {
    // Write update to firearm data to MongoDB
    const responseOnline = await editFirearm({
      variables: {
        _id: id,
        name: firearmData.name,
        ignitionType: firearmData.ignitionType,
        barrelLength: firearmData.barrelLength,
        caliber: firearmData.caliber,
        diaTouchHole: firearmData.diaTouchHole,
        distanceToTarget: firearmData.distanceToTarget,
        muzzleVelocity: firearmData.muzzleVelocity,
        diaRearSight: firearmData.diaRearSight,
        diaFrontSight: firearmData.diaFrontSight,
        heightFrontSight: firearmData.heightFrontSight,
        heightRearSight: firearmData.heightRearSight,
        sightRadius: firearmData.sightRadius,
        notes: firearmData.notes,
        measureSystem: firearmData.measureSystem,
      },
    });
    return responseOnline;
  };

  const updateDeletedFirearmData = async (id) => {
    const responseOnline = await deleteFirearm({
      variables: {
        _id: id,
      },
    });
    return responseOnline;
  };
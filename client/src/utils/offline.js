// Services to handle temporary offline storage
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";

export const db = new Dexie("rangeLogDb");

export const init = () => {
  db.version(1).stores({
    firearms: "id, operation",
    logs: "id, firearmId, date, target, shot, operation",
  });
};

export const firearmDataArray = async () => {
  return await db.firearms.toArray();
  };

export const addFirearmData = async (firearmData, frontSightHeight, operation) => {
  const addResponse = await db.firearms.put({
    // uuid for unique id
    id: uuidv4(),
    operation: operation,
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
    heightFrontSight: parseFloat(frontSightHeight.toFixed(3)),
    sightRadius: firearmData.sightRadius,
    notes: firearmData.notes,
    measureSystem: firearmData.measureSystem,
  });
  return addResponse;
};

export const putFirearmData = async (firearmData, id, frontSightHeight, operation) => {
  const putResponse = await db.firearms.put({
    id: id,
    operation: operation,
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
    heightFrontSight: parseFloat(frontSightHeight.toFixed(3)),
    sightRadius: firearmData.sightRadius,
    notes: firearmData.notes,
    measureSystem: firearmData.measureSystem,
  });
  return putResponse;
};

export const deleteFirearmData = async (id, operation) => {
  const deleteResponse = await db.firearms.put({
    id: id,
    operation: operation,
  });
  return deleteResponse;
};
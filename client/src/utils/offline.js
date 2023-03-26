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

export const firearmDataArray = async (operation) => {
  return await db.firearms.where({ operation: operation }).toArray();
};

export const putFirearmData = async (firearmData, operation) => {
  const putResponse = await db.firearms.put({
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
    sightRadius: firearmData.sightRadius,
    notes: firearmData.notes,
    measureSystem: firearmData.measureSystem,
  });
  return putResponse;
};

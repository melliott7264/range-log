// Services to handle temporary offline storage
import Dexie from "dexie";

export const db = new Dexie("rangeLogDb");

export const init = () => {
  db.version(1).stores({
    firearms: "id, operation",
    logs: "id, firearmId, date, target, shot, operation",
  });
};

export const firearmDataArray = async (operation) => {
  return await db.firearms.where({operation: operation}).toArray();
};

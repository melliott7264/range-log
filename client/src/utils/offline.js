// Services to handle temporary offline storage
import Dexie from 'dexie';
// used to upload firearm data
import { useMutation } from "@apollo/client";
import { ADD_FIREARM, EDIT_FIREARM, REMOVE_FIREARM, ADD_LOG_ENTRY} from "../utils/mutations";


//Create a new class to service offline storage
class OfflineService {
  //Check if network online - returns true or false
  onlineCheck() {
    return navigator.onLine;
    }

  //Check if offline data exists - return true or false
  async savedDataCheck(table) {
    const db = new Dexie('rangeLogDb');
    db.version(1).stores({
        firearms: `id,
                   name,
                   ignitionType,
                   barrelLength,
                   caliber,
                   diaTouchHole,
                   distanceToTarget,
                   muzzleVelocity,
                   diaRearSight,
                   diaFrontSight,
                   heightRearSight,
                   sightRadius,
                   notes,
                   measureSystem
                   operation`,
        logs:     `id,
                   firearmId,
                   date,
                   target,
                   shot,
                   targetType,
                   targetDistance,
                   shootingPosition,
                   measureSystem,
                   temperature,
                   humidity,
                   windSpeed,
                   windDirection,
                   scoreRing,
                   scoreX,
                   scoreOrientation,
                   projectileType,
                   prijectileDiameter,
                   projectileWeight,
                   patchMaterial,
                   patchThickness,
                   patchLube,
                   powderBrand,
                   powderGrade,
                   powderLot,
                   powderCharge,
                   notes
                   operation`
    });
   
    if (table === "firearms") {
    const firearmsOperations = await db.firearms.where("operation").anyOf("ADD", "EDIT", "DELETE").count();
        if (firearmsOperations >= 1) {return true} else {return false}
    }
    if (table === "logs") {
        const logsOperations = await db.logs.where("operation").anyOf("ADD", "EDIT", "DELETE").count();
        if (logsOperations >=1) {return true} else {return false}
    }
  }


  //Save firearm data to offline storage
  saveFirearmData(firearmData, operation) {
    // Must save a field with ADD/EDIT/DELETE operation along with firearm data

  }
  //Write offline firearm data to online database
  async updateFirearmData() {
// const [addFirearm] = useMutation(ADD_FIREARM);
// const [editFirearm] = useMutation(EDIT_FIREARM);
// const [deleteFirearm] = useMutation(REMOVE_FIREARM);
// const response = await addFirearm/editFirearm({
//   variables: {
//     name: from IndexedDB,
//     ignitionType: from IndexedDB,
//     barrelLength: from IndexedDB,
//     caliber: from IndexedDB,
//     diaTouchHole: from IndexedDB,
//     distanceToTarget: from IndexedDB,
//     muzzleVelocity: from IndexedDB,
//     diaRearSight: from IndexedDB,
//     diaFrontSight: from IndexedDB,
//     heightRearSight: from IndexedDB,
//     sightRadius: from IndexedDB,
//     notes: from IndexedDB,
//     measureSystem: from IndexedDB,
//   },
// });
// const response = await deleteFirearm({
//     variables: {
//         _id: id,
//     },
// });
 }

}

export default new OfflineService();

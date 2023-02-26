// Services to handle temporary offline storage
import Dexie from 'dexie';
// used to upload firearm data
import { useMutation } from "@apollo/client";
import { ADD_FIREARM, EDIT_FIREARM, REMOVE_FIREARM, ADD_LOG_ENTRY} from "../utils/mutations";
import {v4 as uuidv4 } from 'uuid';


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
  async saveFirearmData(firearmData, operation, id) {
    // Must save a field with ADD/EDIT/DELETE operation along with firearm data
    try {
    if (id) {
        const firearmId = id
    } else {
        const firearmId = uuidv4();
    }
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
    
    const response = await db.firearms.buldAdd([{
            id: firearmId,
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
            sightRadius:  firearmData.sightRadius,
            notes: firearmData.notes,
            measureSystem: firearmData.measureSystem,
            operation: operation
    }]);
} catch { Dexie.BulkError, (e) => {
    console.error(e)
}};
  };


  //Write offline firearm data to online database
async updateFirearmData() {
    const [addFirearm] = useMutation(ADD_FIREARM);
    const [editFirearm] = useMutation(EDIT_FIREARM);
    const [deleteFirearm] = useMutation(REMOVE_FIREARM);

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

    const firearmsAdds = await db.firearms.where("operation").equals("ADD");
    if (firearmsAdds.length>=1) {
        for (let i=0; i<firearmsAdds.length; i++) {
        const response = await addFirearm({
        variables: {
            name: firearmsAdds[i].name,
            ignitionType: firearmsAdds[i]. ignitionType,
            barrelLength: firearmsAdds[i]. ignitionType,
            caliber: firearmsAdds[i]. ignitionType,
            diaTouchHole: firearmsAdds[i]. ignitionType,
            distanceToTarget: firearmsAdds[i]. ignitionType,
            muzzleVelocity: firearmsAdds[i]. ignitionType,
            diaRearSight: firearmsAdds[i]. ignitionType,
            diaFrontSight: firearmsAdds[i]. ignitionType,
            heightRearSight: firearmsAdds[i]. ignitionType,
            sightRadius: firearmsAdds[i]. ignitionType,
            notes: firearmsAdds[i]. ignitionType,
            measureSystem: firearmsAdds[i]. ignitionType,
            },
        });
    }

    const firearmsAdds = await db.firearms.where("operation").equals("EDIT");
    if (firearmsAdds.length>=1) {
        for (let i=0; i<firearmsAdds.length; i++) {
        const response = await editFirearm({
        variables: {
            _id: firearmsAdds[i].id,
            name: firearmsAdds[i].name,
            ignitionType: firearmsAdds[i]. ignitionType,
            barrelLength: firearmsAdds[i]. ignitionType,
            caliber: firearmsAdds[i]. ignitionType,
            diaTouchHole: firearmsAdds[i]. ignitionType,
            distanceToTarget: firearmsAdds[i]. ignitionType,
            muzzleVelocity: firearmsAdds[i]. ignitionType,
            diaRearSight: firearmsAdds[i]. ignitionType,
            diaFrontSight: firearmsAdds[i]. ignitionType,
            heightRearSight: firearmsAdds[i]. ignitionType,
            sightRadius: firearmsAdds[i]. ignitionType,
            notes: firearmsAdds[i]. ignitionType,
            measureSystem: firearmsAdds[i]. ignitionType,
            },
        });
    }
    const response = await deleteFirearm({
        variables: {
            _id: id,
        },
    });

 }

}

export default new OfflineService();

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
        let firearmId = "";
    if (id) {
        firearmId = id
    } else {
        firearmId = uuidv4();
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
            ignitionType: firearmsAdds[i].ignitionType,
            barrelLength: firearmsAdds[i].barrelLength,
            caliber: firearmsAdds[i].caliber,
            diaTouchHole: firearmsAdds[i].diaTouchHole,
            distanceToTarget: firearmsAdds[i].distanceToTarget,
            muzzleVelocity: firearmsAdds[i].muzzleVelocity,
            diaRearSight: firearmsAdds[i].diaRearSight,
            diaFrontSight: firearmsAdds[i].diaFrontSight,
            heightRearSight: firearmsAdds[i].heightRearSight,
            sightRadius: firearmsAdds[i].sightRadius,
            notes: firearmsAdds[i].notes,
            measureSystem: firearmsAdds[i].measureSystem,
            },
        });
        }
    }

    const firearmsEdits = await db.firearms.where("operation").equals("EDIT");
    if (firearmsEdits.length>=1) {
        for (let i=0; i<firearmsEdits.length; i++) {
        const response = await editFirearm({
        variables: {
            _id: firearmsEdits[i].id,
            name: firearmsEdits[i].name,
            ignitionType: firearmsEdits[i].ignitionType,
            barrelLength: firearmsEdits[i].barrelLength,
            caliber: firearmsEdits[i].caliber,
            diaTouchHole: firearmsEdits[i].diaTouchHole,
            distanceToTarget: firearmsEdits[i].distanceToTarget,
            muzzleVelocity: firearmsEdits[i].muzzleVelocity,
            diaRearSight: firearmsEdits[i].diaRearSight,
            diaFrontSight: firearmsEdits[i].diaFrontSight,
            heightRearSight: firearmsEdits[i].heightRearSight,
            sightRadius: firearmsEdits[i].sightRadius,
            notes: firearmsEdits[i].notes,
            measureSystem: firearmsEdits[i].measureSystem,
            },
        });
        }
    }    

    const firearmsDeletes = await db.firearms.where("operation").equals("DELETE");
    if (firearmsEdits.length>=1) {
        for (let i=0; i<firearmsEdits.length; i++) {
        const response = await deleteFirearm({
        variables: {
            _id: firearmsDeletes[i].id,
            },
        });
        }
    }  

 }

}

export default new OfflineService();

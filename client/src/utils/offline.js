// Services to handle temporary offline storage

// used to upload firearm data
import { useMutation } from "@apollo/client";
import { ADD_FIREARM } from "../utils/mutations";


//Create a new class to service offline storage
class OfflineService {
  //Check if network online - returns true or false
  onlineCheck() {}

  //Check if offline data exists - return true or false
  savedDataCheck() {}

  //Save firearm data to online storage
  saveFirearmData(firearmData) {
    
  }
  //Write offline firearm data to online database
  updateFirearmData() {
// const [addFirearm] = useMutation(ADD_FIREARM);
// const response = await addFirearm({
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
  }

  //Write offline log data to online database
  updateLogData() {}

}

export default new OfflineService();

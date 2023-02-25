// Services to handle temporary offline storage

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
  savedDataCheck() {}

  //Save firearm data to online storage
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
//   }

  saveSessionData(sessionData){}

  //Write offline log data to online database
  updateSessionData() {
//     const [addSession] = useMutation(ADD_LOG_ENTRY);
//     const response = await addSession({
//         variables: {
//           firearmId: selectedFirearm,
//           date: dayjs(),
//           target: 1,
//           shot: 1,
//         },
//       });
  }



}

export default new OfflineService();

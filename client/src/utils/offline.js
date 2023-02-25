// Services to handle temporary offline storage

// used to upload firearm data
import { useMutation } from "@apollo/client";
import { ADD_FIREARM } from "../utils/mutations";

import AuthService from "../utils/auth";

//Create a new class to service offline storage
class OfflineService {
  //Check if network online
  onlineCheck() {}

  savedDataCheck() {}
}

export default new OfflineService();

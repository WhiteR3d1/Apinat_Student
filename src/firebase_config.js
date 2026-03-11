import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const { REACT_APP_APIKEY, REACT_APP_AUTHDOMAIN, REACT_APP_PRJID, REACT_APP_APPID } = process.env;

const firebaseConfig = {
    apiKey: REACT_APP_APIKEY,
    authDomain: REACT_APP_AUTHDOMAIN,
    projectId: REACT_APP_PRJID,
    appId: REACT_APP_APPID
}
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
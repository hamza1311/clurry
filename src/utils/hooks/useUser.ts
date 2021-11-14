import {useContext} from "react";
import { UserContext } from "../../components/App";
import firebase from "firebase/app";

const useUser = () => {
    return useContext<firebase.User | null>(UserContext)
}

export default useUser


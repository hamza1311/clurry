import {useEffect, useState} from "react";
import Room from "../../models/Room";
import useUser from "./useUser";
import {collection, where, getFirestore, onSnapshot, query} from "firebase/firestore";

const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([])

    const user = useUser();
    useEffect(() => {
        const firestore = getFirestore();
        if (user === null) {
            return () => {
            }
        }
        return onSnapshot(
            query(collection(firestore, 'rooms'), where('members', 'array-contains', user.uid)),
            snapshot => {
                const rooms = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const output: Room = {
                        id: doc.id,
                        createTime: data.createTime,
                        members: data.members,
                        name: data.name,
                    }
                    return output
                })
                setRooms(rooms)
            }
        )
    }, [user])

    return rooms
}

export default useRooms

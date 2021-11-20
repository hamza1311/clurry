import User from '../models/User'
import { getFirestore, collection, getDoc, doc } from 'firebase/firestore'

const getUser = async (userId: string) => {
    const firestore = getFirestore()
    const fetched = await getDoc(doc(collection(firestore, 'users'), userId))
    const data = fetched.data()
    if (data === undefined) {
        return undefined
    }

    const user: User = {
        id: userId,
        displayName: data.displayName,
        email: data.email
    }
    return user
}

export default getUser

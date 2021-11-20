import useStorageFile from './useStorageFile'
import User from '../../models/User'

const useUserProfilePicture = (user: User | null | undefined) => {
    const path = user ? `/profilePictures/${user.id}` : undefined
    return useStorageFile(path)
}

export default useUserProfilePicture

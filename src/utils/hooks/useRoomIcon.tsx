import useStorageFile from './useStorageFile'

const useRoomIcon = (roomId?: string) => {
    const path = `/roomIcons/${roomId}`
    return useStorageFile(path)
}

export default useRoomIcon

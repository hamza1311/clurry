import { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'

const useStorageFile = (storagePath: string | undefined) => {
    const [downloadURL, setDownloadURL] = useState<string | undefined>()
    const storage = getStorage()

    useEffect(() => {
        if (storagePath !== undefined) {
            const pathRef = ref(storage, storagePath)
            getDownloadURL(pathRef)
                .then((url) => {
                    setDownloadURL(url)
                })
                .catch((it) => {
                    if (it.code  !== 'storage/object-not-found') {
                        console.error(it)
                    }
                })
        }
    }, [storage, storagePath])

    return downloadURL
}

export default useStorageFile

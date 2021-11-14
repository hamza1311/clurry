import { useContext } from 'react'
import { UserContext } from '../../components/App'
import { User } from '@firebase/auth'

const useUser = () => {
    return useContext<User | null>(UserContext)
}

export default useUser


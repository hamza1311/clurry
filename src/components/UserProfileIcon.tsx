import React, { useEffect, useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import useUser from '../utils/hooks/useUser'
import User from '../models/User'
import getUser from '../utils/getUser'
import { useHistory } from 'react-router'
import IconButton from '@mui/material/IconButton'
import { Avatar, Menu, MenuItem } from '@mui/material'

export default function UserProfileIcon() {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const auth = getAuth()
    const currentUser = useUser()
    const [user, setUser] = useState<User | undefined>(undefined)
    useEffect(() => {
        if (currentUser !== null) {
            getUser(currentUser?.uid).then((fetchedUser) => {
                setUser(fetchedUser)
            })
        }
    }, [currentUser])

    const history = useHistory()

    const navigateToProfile = async () => {
        history.push('/profile')
        handleClose()
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    // @ts-ignore
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }


    const pfp = user?.profilePicture ?? undefined

    return (
        <>
            <IconButton onClick={handleMenu}>
                <Avatar src={pfp} alt='user pfp'/>
            </IconButton>
            <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
                <MenuItem onClick={() => signOut(auth)}>Sign out</MenuItem>
            </Menu>
        </>
    )
}

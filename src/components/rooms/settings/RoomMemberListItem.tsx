import { useEffect, useState } from 'react'
import User from '../../../models/User'
import getUser from '../../../utils/getUser'
import ListItemSkeleton from '../../utils/skeletons/ListItemSkeleton'
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import * as React from 'react'
import useUserProfilePicture from '../../../utils/hooks/useUserProfilePicture'

const RoomMemberListItem = ({ member: memberId }: { member: string }) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        getUser(memberId).then((fetched) => {
            setUser(fetched ?? null)
        })
    }, [memberId])

    const pfp = useUserProfilePicture(user)

    if (user === null) {
        return <ListItemSkeleton/>
    }

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={pfp} alt={`${user.displayName}'s avatar`}/>
            </ListItemAvatar>
            <ListItemText>{user.displayName}</ListItemText>
        </ListItem>
    )
}

export default RoomMemberListItem

import Room from '../models/Room'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import UserProfileIcon from './UserProfileIcon'
import React from 'react'

export default function AppToolbarContent(props: { selectedRoom: Room }) {
    return <>
        <Typography variant='h6' noWrap>
            {props.selectedRoom.name}
        </Typography>
        <Box sx={{ flex: '1 1 auto' }}/>
        <UserProfileIcon/>
    </>
}

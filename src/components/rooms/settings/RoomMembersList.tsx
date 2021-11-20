import Room from '../../../models/Room'
import { Collapse, List } from '@mui/material'
import { TransitionGroup } from 'react-transition-group'
import * as React from 'react'
import AddMemberListItem from './AddMemberListItem'
import RoomMemberListItem from './RoomMemberListItem'

const RoomMembersList = ({ room }: { room: Room }) => {
    return (
        <List sx={{ width: (theme) => ({ [theme.breakpoints.up('sm')]: '40%' }) }}>
            <TransitionGroup>
                <AddMemberListItem key='add-user' room={room}/>
                {room.members.map((member) => (
                    <Collapse key={member}>
                        <RoomMemberListItem member={member}/>
                    </Collapse>
                ))}
            </TransitionGroup>
        </List>
    )
}

export default RoomMembersList

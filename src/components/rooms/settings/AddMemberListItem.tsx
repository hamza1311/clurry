import Room from '../../../models/Room'
import { useRef, useState } from 'react'
import { arrayUnion, collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore'
import {
    Button,
    Collapse,
    FormControl, IconButton,
    Input,
    InputAdornment,
    InputLabel,
    ListItem,
    ListItemButton
} from '@mui/material'
import { TransitionGroup } from 'react-transition-group'
import AddIcon from '@mui/icons-material/Add'
import FlexBox from '../../utils/FlexBox'
import CheckIcon from '@mui/icons-material/Check'
import * as React from 'react'

const AddMemberListItem = ({ room }: { room: Room }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const memberEmailRef = useRef<{ value: string }>()

    const firestore = getFirestore()

    const addMember = async () => {
        setIsDisabled(true)
        const roomDocument = doc(firestore, 'rooms', room.id)
        const userQuery = query(collection(firestore, 'users'), where('email', '==', memberEmailRef.current!!.value))
        const userDocs = await getDocs(userQuery)
        if (userDocs.empty) {
            // TODO handle this case properly
            alert('no user with this email found')
        } else {
            // this `forEach` is fine because only one user can be registered with one email
            userDocs.forEach((user) => {
                updateDoc(roomDocument, {
                    members: arrayUnion(user.id)
                }).catch((e) => console.error('failed to add member', e))
            })
        }
        setIsEditing(false)
        setIsDisabled(false)
    }
    return (
        <ListItem>
            <TransitionGroup style={{ width: '100%' }}>
                {!isEditing && <Collapse unmountOnExit>
                    <ListItemButton disabled={isDisabled} component={Button} onClick={() => setIsEditing(true)}
                                    sx={{ width: '100%' }}>
                        <AddIcon/>
                        Add Member
                    </ListItemButton>
                </Collapse>}
                {isEditing && <Collapse unmountOnExit>
                    <FlexBox>
                        <FormControl variant='standard' sx={{ width: '100%' }} disabled={isDisabled}>
                            <InputLabel htmlFor='member-email'>Email</InputLabel>
                            <Input
                                id='member-email'
                                inputRef={memberEmailRef}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={() => addMember()}
                                            onMouseDown={(e) => e.preventDefault()}
                                        >
                                            <CheckIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </FlexBox>
                </Collapse>}
            </TransitionGroup>
        </ListItem>
    )
}

export default AddMemberListItem

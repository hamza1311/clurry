import UserProfileIcon from './UserProfileIcon'
import React, { PropsWithChildren } from 'react'
import SeparatorBox from './utils/SeparatorBox'

export default function AppToolbarContent(props: PropsWithChildren<{}>) {
    return <>
        {props.children}
        <SeparatorBox />
        <UserProfileIcon/>
    </>
}

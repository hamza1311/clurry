import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { Skeleton } from '@mui/material'
import React from 'react'

const useSkeletonStyles = makeStyles((theme: Theme) =>
    createStyles({
        outerContainer: {
            display: 'flex',
            gap: theme.spacing(2),
            padding: theme.spacing(2),
        },
        contentContainer: {
            width: '100%'
        }
    })
)

export default function MessageListItemSkeleton() {
    const classes = useSkeletonStyles()

    return <div className={classes.outerContainer}>
        <Skeleton variant='circular' width={45} height={40}/>
        <div className={classes.contentContainer}>
            <Skeleton variant='text' width='30%'/>
            <Skeleton variant='text'/>
        </div>
    </div>
}

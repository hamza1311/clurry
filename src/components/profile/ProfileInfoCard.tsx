import { Card, CardContent } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
    card: {
        width: '50%',
        [theme.breakpoints.down('sm')]: {
            width: '90%',
            margin: 'auto',
        }
    },
    cardContent: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
    },
}))
export const ProfileInfoCard = ({ children }: PropsWithChildren<{}>) => {
    const classes = useStyles()

    return <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
            {children}
        </CardContent>
    </Card>
}

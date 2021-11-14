import React, {ElementType} from "react";
import {Theme} from '@mui/material/styles';
import {isToday, isYesterday, isThisWeek, isThisYear, getDate, getYear, format} from 'date-fns'
import Typography from "@mui/material/Typography";
import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1)
    },
}));

const formatTime = (date: Date): string => {
    const isCurrentWeek = isThisWeek(date)
    const isDateYesterday = isYesterday(date)
    let out = ""
    if (isToday(date)) {
        out += "Today"
    } else if (isDateYesterday) {
        out += "Yesterday"
    } else if (isCurrentWeek) {
        out += format(date, 'E..EEE')
    }

    if (!isCurrentWeek && !isDateYesterday) {
        out += `${getDate(date)} ${format(date, 'MMM')}`

        if (!isThisYear(date)) {
            out += ' '
            out += getYear(date)
        }
    }
    out += ', '
    out += format(date, 'hh:mm aaa').toUpperCase()

    return out
}
const Timestamp = ({timestamp, icon: Icon}: { timestamp: Date, icon?: ElementType | undefined }) => {
    const styles = useStyles();

    return <div className={styles.root}>
        { Icon &&  <Icon /> }
        <Typography variant="subtitle2" component="span">{formatTime(timestamp)}</Typography>
    </div>
}

Timestamp.defaultProps = {
    icon: undefined
}

export default Timestamp

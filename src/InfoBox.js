import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './infoBox.css'

function InfoBox({title,cases,isRed,active,total,brightness, ...props}) {
   
    return (
        <Card style={{backgroundColor: brightness ?  'darkslategray' : ''  }} onClick={props.onClick} className={` infoBox ${active && "infoBox--selected"} ${isRed && 'infoBox--isRed'} `}  >
            <CardContent>
                <Typography className='infoBox__title' color='textSecondary'>
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'} `}>{cases} today</h2>
                <Typography className={`infoBox__total ${!isRed && 'infoBox__cases--green'}`} color='textSecondary'>{total} {title.toLowerCase()} total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox

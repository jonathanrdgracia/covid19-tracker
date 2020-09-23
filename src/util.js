import { Circle,Popup } from 'react-leaflet';
import React from 'react'
import numeral from 'numeral'
import './map.css'

export const sortData=(data)=>{
    const sortedData=[...data]

    return sortedData.sort((a,b)=>(a.cases > b.cases ? -1 : 1) )
}

export const prettyPrintStat=stat=>{
    return stat?.toString().length > 3? `${numeral(stat).format("+0,0a")}` : `${numeral(stat).format("0,0")}`
}

const casesTypeColor={
    cases:{
        hex: '#CC1034',
        rgb: 'rgb(204,16,52)',
        half_op: 'rgba(204,16,52,.5)',
        multiplier: 800,
    },
    recovered:{
        hex: '#7dd71d',
        rgb: 'rgb(125,215,29)',
        half_op: 'rgba(125,215,29,.5)',
        multiplier: 1200,
    },
    deaths:{
        hex: '#fb4443',
        rgb: 'rgb(251,68,67)',
        half_op: 'rgba(251,68,67,.5)',
        multiplier: 2000,
    }
}

//Draw circle on the map
export const showDataOnMap=(data, casesType='cases')=>(
    data.map(country=>(
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColor[casesType].hex}
            fillColor={ casesTypeColor[casesType].hex }
            radius={
                Math.sqrt(country[casesType]) * casesTypeColor[casesType].multiplier
            }
        >
            <Popup>
                <div className='info__container'>
                    <div className='info__flag' style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
                    <div className='info__name'>{country.country}</div>
                    <div className='info__cases'>Cases: {numeral(country.cases).format('0,0')}</div>
                    <div className='info__recovered'>Recovered: {numeral(country.recovered).format('0,0')}</div>
                    <div className='info__deaths'>Deaths: {numeral(country.deaths).format('0,0')}</div>
                </div>
            </Popup>
        </Circle>
        
    ))
);
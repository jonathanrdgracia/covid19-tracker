import React from 'react'
import { Map as LeafletMap, TileLayer} from 'react-leaflet'

import './map.css'
import { showDataOnMap } from './util'
function Map({countries,center, zoom,brightness,casesType}) {
    return (
        <div className={`map ${brightness && 'map--black' }`}>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {showDataOnMap(countries,casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map

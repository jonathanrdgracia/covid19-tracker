import { FormControl, MenuItem, Select,Card,CardContent } from '@material-ui/core';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import React, {useState, useEffect} from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css'
import InfoBox from './InfoBox'
import LineGraph from './LineGraph';
import Map from './Map';
import Table from './Table';
import { prettyPrintStat, sortData } from './util';

function App() {
  const [countries, setCountries]= useState([])
  const [country,setCountry] = useState('worldwide')
  const [countryInfo,setCountryInfo] = useState({})
  const [tableData,setTableData]= useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng:-40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')
  const [brightness, setBrightness] = useState(false)

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(resp=> resp.json())
    .then(data=>{
      setCountryInfo(data)
    })
  },[])

  useEffect(()=>{
    brightness && alert('Working on dark theme☀️! 😅')
  },[brightness])

  useEffect(()=>{
    const getCountries= async()=>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then(res=> res.json())
      .then((data)=>{
        const countries= data.map(country=>({
          name: country.country,
          value: country.countryInfo.iso2
        }))
        
        setCountries(countries)
        setTableData(sortData(data))
        setMapCountries(data)
      })
    }
    getCountries()
  },[])

  const onCountryChange=async(event)=>{
    const countryCode= event.target.value
    const url= countryCode === 'worldwide'
    ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((resp)=> resp.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data)

      setMapCenter([data.countryInfo.lat,data.countryInfo.long])
      setMapZoom(4)
    })
  }

  return (
    <div className={`app ${brightness && 'body--black'}`}>
      <div className="app__left">
        <div className="app__header">
          <h1 className={`${brightness && 'letter--white'}`} >COVID-19 TRACKER</h1>
          <div>
          <FormControl className={`app__dropdown ${brightness && 'body--bladck'}`}>
              <Select
                className={`${brightness && 'letter--white app--black'}`}
                onChange={ onCountryChange }
                variant='outlined'
                value={country}>
                  
                  <MenuItem 
                    className='letter--white'
                    value='worldwide'>
                      Worldwide
                  </MenuItem>
                    {countries.map(country=>(
                  <MenuItem className={`${brightness && 'app--black'}`} value={country.value}>{country.name}</MenuItem>
                  ))}
              </Select>
          </FormControl>
            <Card style= {{ backgroundColor: brightness ? 'darkslategray' : '' }} id='brightness' onClick={()=> setBrightness(e=> !brightness) }>
              {brightness ? <BrightnessHighIcon style={{color:'#c8cdd0'}}/> : <BrightnessMediumIcon/>}
            </Card>
          </div>
        </div>

        <div className="app__stats">
          <InfoBox 
            active={casesType === 'cases'}
            isRed
            brightness={brightness}
            onClick={e=> setCasesType('cases')}
            title='Cases'  
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox 
            active={casesType === 'recovered'}
            onClick={e=> setCasesType('recovered')}
            brightness={brightness}
            title='Recovered'  
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox 
            active={casesType === 'deaths'}
            brightness={brightness}
            isRed
            onClick={e=> setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}/>
        </div>
        <Map
          brightness={brightness}
          casesType={casesType}          
          countries={mapCountries}
          center={mapCenter} 
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

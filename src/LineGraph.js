import React, {useState,useEffect} from 'react'
import { Line } from 'react-chartjs-2'
import numeral from  'numeral'

const options={
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        },
    },
    maintaninAspectRatio: false,
    tooltips:{
        mode:'index',
        intersect:false,
        callbacks:{
            label: function(tooltipItem,data){
                return numeral(tooltipItem.value).format('+0,0')
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:'time',
                time:{
                    format: 'MM/DD/YY',
                    tooltipFormat:'ll',
                },
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    //Include a dollar sign in the ticks
                    callback: function(value,index,values){
                        return numeral(value).format('0a');
                    },
                },
            },
        ],
    },
};
const builChartData=(data,casesType='cases')=>{
    const chartData=[]
    let lastDataPoint

    for(let date in data.cases){ //Not an array, its Dictonary object
        if(lastDataPoint){
            const newDataPoint= {
                x:date,
                y:data[casesType][date] - lastDataPoint
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint= data[casesType][date]
    }
    return chartData;
}

function LineGraph({casesType= 'cases'}) {
    const [data,setData]= useState({})

    useEffect(()=>{
        const fetchData=async()=>{
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(resp=> resp.json())
            .then(data=>{
            let chartData= builChartData(data,casesType)
            setData(chartData)
            builChartData(chartData)
            })
        }
        fetchData();
    },[casesType])


   
    return (
        <div>
            {data?.length >0 &&(
                <Line 
                options={options}
                data={{
                datasets: [{
                    backgroundColor: 'rgba(204,16,52,0.5)',
                    borderColor:'#cc1034',
                    data: data
                }]
            }}  />
            )}
        </div>
    )
}

export default LineGraph

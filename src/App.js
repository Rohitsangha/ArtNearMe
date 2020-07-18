import React, {useState, forceUpdate} from 'react';


import '@elastic/eui/dist/eui_theme_dark.css';
import styles from"./App.module.css";

import { Header, Superselect} from './components';

import {Map, TileLayer, Marker, Popup, Polygon, MapLayer,GeoJSON} from "react-leaflet";

import { TargomoClient } from '@targomo/core' 

import * as art from './assets/art1.json'

import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageSideBar,
    EuiFieldSearch,
    EuiButton,
    EuiForm,
  } from '@elastic/eui';

const App = () => {

    //State monitors
    const [polygon,updatepoly] = useState([]);
    const [source,updatesource] = useState([]);
    const [valueMode, setValueMode] = useState('car');
    const [valueTime, setValueTime] = useState('300');
    const [newInput, setNewInput] = useState('') 
    

    //Api keys **move to env file
    const mapKey = '7YdX4yPR0NXL8R9yqDyX';
    const mapAkey = 'AWVFN900CECDXH4S6HQC308181228';
    const geoKey = '47c493e6f47ef825d3817edf9f60f282a1042dbe';

    //reference to <Map> element 
    let mapRef = React.useRef();

    //defining basemap
    const tilesUrl = `https://api.maptiler.com/maps/positron/{z}/{x}/{y}@2x.png?key=${mapKey}`;
  
    //Mapping Data
    const center = [49.2827, -123.1207];

    //console.log(art[0].fields.descriptionofwork);


    function initMap(type,time,source) {

        //Setting Source
        updatesource([[source[1],source[0]]])
        const sources = [{ id: 0, lat: source[1], lng: source[0] }];

        //colors for leaflet map
        const colors1 = ['rgb(0, 104, 55)', 'rgb(57, 181, 74)', 'rgb(140, 198, 63)'] 
        const colors2= ['rgb(247, 147, 30)', 'rgb(241, 90, 36)', 'rgb(193, 39, 45)'];

        // create targomo client
        const client = new TargomoClient('northamerica', `${mapAkey}`);

        //reference to map current
        const map = mapRef.current;
      
        // polygons time rings
        let travelTimes = undefined;
        let TravelTimes2 = undefined;
        let maxEdgeWeight = undefined;

        let rPolyObject = [];

        switch (+time) {
            case 300: 
            travelTimes = [300];
            maxEdgeWeight = 300;
            break;

            case 600: 
            travelTimes = [300, 600];
            maxEdgeWeight = 600;
            break;

            case 900: 
            travelTimes = [300,600,900];
            maxEdgeWeight = 900;
            break;

            case 1200: 
            travelTimes = [300,600,900];
            TravelTimes2 = [1200];
            maxEdgeWeight = 1200;
            break;

            case 1500: 
            travelTimes = [300,600,900];
            TravelTimes2 = [1200,1500];
            maxEdgeWeight = 1500;
            break;

            case 1800: 
            travelTimes = [300,600,900];
            TravelTimes2 = [1200,1500,1800];
            maxEdgeWeight = 1800;
            break;
        }
    

        // polygon service options
        const callOptions = (type,travel,max) => {
            const vals = {
                travelType: type,
                travelEdgeWeights: travel,
                maxEdgeWeight: max,
                edgeWeight: 'time',
                serializer: 'geojson',
                srid:4326
            };
        return vals;
        }

        //function reverse lat long of api response
        const reverse = (data) => {
            for(let i = 0; i < data.length; i++) {
                let lat = data[i][1];
                let lng =  data[i][0];
                data[i][0] =  lat;
                data[i][1] =  lng;
            }
        }

        console.log(travelTimes);

        //Polygon options object creator for leaflet display
        async function createPoly(tt,color) {
        
                let options = callOptions(type,tt,maxEdgeWeight);
                const polygonstest = await client.polygons.fetch(sources, options);
                console.log(polygonstest);
                let index = 0;

                tt.forEach(timeVal => {
                    for(let i=0; i<polygonstest.features.length; i++) {
                        if(polygonstest.features[i].properties.time === timeVal) {
                            let data = polygonstest.features[i].geometry.coordinates[0][0];
                            reverse(data)
                            rPolyObject.push({position: data , color:color[index]})
                        }
                    }
                    index++;
                });
            }


        // Async function to see if both fetch calls are completed
        
        async function caller() {
        await createPoly(travelTimes,colors1)

        if (TravelTimes2!=undefined) {
            await createPoly(TravelTimes2,colors2)
        }

        updatepoly(rPolyObject.reverse())
    }
     
    caller()

    }

    //Search function calls geocodify api then initMap function
    const search = (event) => {

        event.preventDefault();

        let type = valueMode;
        let time = valueTime;

        fetch(`https://api.geocodify.com/v2/geocode?api_key=${geoKey}&q=${newInput}`)
        .then(res => res.json())
        .then(data => data.response.features[0].geometry.coordinates)
        .then(data => {initMap(type,time,data)});
    
        
    }


    return (
    <>
    {/* Using elastic page,sidebar and header modules */}
    <Header />

        <EuiPage>

            <EuiPageSideBar>

                <EuiForm component="form" onSubmit={search}>

                    <EuiFieldSearch
                        placeholder="Enter An Address"
                        fullWidth
                        value={newInput}
                        onChange={event => setNewInput(event.target.value)}
                    />

                    <EuiButton fullWidth style={{marginTop:'20px', marginBottom:'20px'}} onClick={() => setNewInput('453 W 12th Ave Vancouver')}>Example Location</EuiButton>

                    <Superselect value={valueMode} setValue={setValueMode} style={{marginTop:'20px'}} choose="1"></Superselect>
                    <Superselect value={valueTime} setValue={setValueTime} style={{marginTop:'20px'}}></Superselect>

                    <EuiButton fullWidth style={{marginTop:'20px'}} fill style={{marginTop:'20px', marginBottom:'10px'}} type="submit" >Search</EuiButton>

                </EuiForm>
             

            </EuiPageSideBar>

            <EuiPageBody component="div">

                <EuiPageContent>

                    {/* Importing leaflet map and baselayer */}

                    <Map className={styles.leaflet} center={center} zoom={11} scrollWheelZoom={false} ref={mapRef}>

                        <TileLayer url={tilesUrl} tileSize={512} crossOrigin="true" minZoom={6} zoomOffset={-1}/>

                        {source.map(data => (<Marker position={data}></Marker>))}
                        {polygon.map(data => (<Polygon color={data.color} positions={data.position} opacity="0"></Polygon>))}
                    
                    </Map>

    

                </EuiPageContent>

            </EuiPageBody>

        </EuiPage>

    </>

    )

}

export default App;
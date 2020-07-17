import React, {useState, useEffect} from 'react';


import '@elastic/eui/dist/eui_theme_dark.css';
import styles from"./App.module.css";

import { Header, Superselect} from './components';

import {Map, TileLayer, Marker, Popup, Polygon, MapLayer,GeoJSON} from "react-leaflet";

import { TargomoClient } from '@targomo/core' 




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
    const [valueMode, setValueMode] = useState('walk');
    const [valueTime, setValueTime] = useState('300');
    const [newInput, setNewInput] = useState('') 


    //Api keys **move to env file
    const mapKey = '7YdX4yPR0NXL8R9yqDyX';
    const mapAkey = 'AWVFN900CECDXH4S6HQC308181228';
    const geoKey = undefined;

    //defining basemap
    const tilesUrl = `https://api.maptiler.com/maps/positron/{z}/{x}/{y}@2x.png?key=${mapKey}`;
  
    
    //Mapping Data
    const center = [49.2827, -123.1207];
    const sources = [{ id: 0, lat: center[0], lng: center[1] }];


    async function initMap() {

        // create targomo client
        const client = new TargomoClient('northamerica', `${mapAkey}`);
      
        // polygons time rings
        const travelTimes = [900];
    
        // polygon service options
        const options = {
            travelType: 'walk',
            travelEdgeWeights: travelTimes,
            maxEdgeWeight: 900,
            edgeWeight: 'time',
            serializer: 'geojson',
            srid:4326
        };

        
        const polygonstest = await client.polygons.fetch(sources, options);
        console.log(polygonstest);
        let data = polygonstest.features[0].geometry.coordinates[0][0];
        

        for(let i = 0; i < data.length; i++){
            let lat = data[i][1];
            let lng =  data[i][0];
            data[i][0] =  lat;
            data[i][1] =  lng;
        }

        updatepoly(data);
   
    }


    return (
    <>
    {/* Using elastic page,sidebar and header modules */}
    <Header />

        <EuiPage>

            <EuiPageSideBar>

                <EuiForm component="form">

                    <EuiFieldSearch
                        placeholder="Enter An Address"
                        fullWidth
                        value={newInput}
                        onChange={event => setNewInput(event.target.value)}
                    />

                    <EuiButton fullWidth style={{marginTop:'20px', marginBottom:'20px'}}>Example Location</EuiButton>

                    <Superselect value={valueMode} setValue={setValueMode} style={{marginTop:'20px'}} choose="1"></Superselect>
                    <Superselect value={valueTime} setValue={setValueTime} style={{marginTop:'20px'}} ></Superselect>

                    <EuiButton fullWidth style={{marginTop:'20px'}} fill style={{marginTop:'20px', marginBottom:'10px'}}  onClick={() => {initMap()}} >Search</EuiButton>

                </EuiForm>
             

            </EuiPageSideBar>

            <EuiPageBody component="div">

                <EuiPageContent>

                    {/* Importing leaflet map and baselayer */}

                    <Map className={styles.leaflet} center={center} zoom={11} scrollWheelZoom={false}>
                        <TileLayer url={tilesUrl} tileSize={512} crossOrigin="true" minZoom={6} zoomOffset={-1}/>
                        <Polygon color="red" positions={polygon} opacity="0" ></Polygon>
                    
                    </Map>

                </EuiPageContent>

            </EuiPageBody>

        </EuiPage>

    </>

    )

}

export default App;
import React, {useState, useEffect} from 'react';


import '@elastic/eui/dist/eui_theme_light.css';
import styles from"./App.module.css";

import { Header,} from './components';

import {Map, TileLayer, Marker, Popup, Polygon, MapLayer, GeoJSON} from "react-leaflet";

import { TargomoClient } from '@targomo/core' 



import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageSideBar,
  } from '@elastic/eui';




const App = () => {

    const [polygon,updatepoly] = useState([]);
    const [polygon1,updatepoly1] = useState([]);
    const [polygon2,updatepoly2] = useState([]);

    const mapKey = '7YdX4yPR0NXL8R9yqDyX';
    const mapAkey = 'AWVFN900CECDXH4S6HQC308181228';
    const geoKey = undefined;

    //defining basemap
    const tilesUrl = `https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}@2x.png?key=${mapKey}`;
  
    
    //Mapping Data
    const center = [49.2827, -123.1207];
    const sources = [{ id: 0, lat: center[0], lng: center[1] }];


    async function initMap() {

        // create targomo client
        const client = new TargomoClient('northamerica', `${mapAkey}`);
      
        // polygons time rings
        const travelTimes = [300, 600, 900];
    
        // polygon service options
        const options = {
            travelType: 'Walk',
            travelEdgeWeights: travelTimes,
            maxEdgeWeight: 1800,
            edgeWeight: 'time',
            serializer: 'geojson',
            srid:4326
        };

        
        const polygonstest = await client.polygons.fetch(sources, options);
        console.log(polygonstest);
        let data = polygonstest.features[0].geometry.coordinates[0][0];
        let data1 = polygonstest.features[1].geometry.coordinates[0][0];
        let data2 = polygonstest.features[2].geometry.coordinates[0][0];

        for(let i = 0; i < data.length; i++){
            let lat = data[i][1];
            let lng =  data[i][0];
            data[i][0] =  lat;
            data[i][1] =  lng;
        }

        for(let i = 0; i < data1.length; i++){
            let lat = data1[i][1];
            let lng =  data1[i][0];
            data1[i][0] =  lat;
            data1[i][1] =  lng;
        }

        for(let i = 0; i < data2.length; i++){
            let lat = data2[i][1];
            let lng =  data2[i][0];
            data2[i][0] =  lat;
            data2[i][1] =  lng;
        }

        updatepoly(data);
        updatepoly1(data1)
        updatepoly2(data2)
    }


    return (
    <>
    {/* Using elastic page,sidebar and header modules */}
    <Header />
        <EuiPage>
            <EuiPageSideBar><button onClick={() => {initMap()}}>test</button></EuiPageSideBar>
            <EuiPageBody component="div">
                <EuiPageContent>
                    {/* Importing leaflet map and baselayer */}
                    <Map className={styles.leaflet} center={center} zoom={11.48} scrollWheelZoom={false}>
                        <TileLayer url={tilesUrl}/>
                        <Polygon color="red" positions={polygon} opacity="0"></Polygon>
                        <Polygon color="orange" positions={polygon1} opacity="0"></Polygon>
                        <Polygon color="green" positions={polygon2} opacity="0"></Polygon>
                    </Map>
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    </>

    )

}

export default App;
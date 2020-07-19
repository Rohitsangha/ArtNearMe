import React, {useState} from 'react';

import '@elastic/eui/dist/eui_theme_dark.css';
import styles from"./App.module.css";

import { Header, Superselect} from './components';

import {Map, TileLayer, Marker, Popup, Polygon} from "react-leaflet";

import { TargomoClient } from '@targomo/core';

import * as art from './assets/art1.json';

import { Icon } from 'leaflet';


import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageSideBar,
    EuiFieldSearch,
    EuiButton,
    EuiForm,
    EuiCallOut
  } from '@elastic/eui';


const App = () => {

    //State monitors
    const [polygon,updatepoly] = useState([]);
    const [source,updatesource] = useState([]);
    const [valueMode, setValueMode] = useState('walk');
    const [valueTime, setValueTime] = useState('300');
    const [newInput, setNewInput] = useState('');
    const [markers, setNewMarker] = useState([]);
    const [warningMessage, setWM] = useState(false);
    

    //Api keys **move to env file
    const mapKey = '7YdX4yPR0NXL8R9yqDyX';
    const mapAkey = 'AWVFN900CECDXH4S6HQC308181228';
    const geoKey = '47c493e6f47ef825d3817edf9f60f282a1042dbe';

    //reference to <Map> element 
    let mapRef = React.useRef();

    //art icon
    const icon = new Icon({
        iconUrl: require("./brush.svg"),
        iconSize: [20, 20]
      });


    //defining basemap
    const tilesUrl = `https://api.maptiler.com/maps/positron/{z}/{x}/{y}@2x.png?key=${mapKey}`;
  
    //Mapping Data
    const center = [49.2827, -123.1207];

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
        map.leafletElement.attributionControl.addAttribution('Rohit Sangha');
      
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


        //Polygon options object creator for leaflet display
        async function createPoly(tt,color) {
        
                let options = callOptions(type,tt,maxEdgeWeight);
                const polygonstest = await client.polygons.fetch(sources, options);
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

        //Zoom to polygon bounding box
        let minY = 90;
        let minX = 180;
        let maxY = 0;
        let maxX = -180;

        let box = rPolyObject.reverse();
        box = box[0].position

        for(let i = 0; i < box.length; i++) {
           if (box[i][0] > maxY) maxY = box[i][0]
           if (box[i][0] < minY) minY = box[i][0]
           if (box[i][1] > maxX) maxX = box[i][1]
           if (box[i][1] < minX) minX = box[i][1]

        }

        map.leafletElement.fitBounds([[maxY,maxX],[minY,minX]])
        
        //Update polygon object
        updatepoly(rPolyObject)

        //Run ray casting algorithm to check if point is in polygon.
        let shownMarkers = [];
        let testing = art.default;

        function pointInPoly(marker) {

            var x = marker.fields.geom.coordinates[1], y = marker.fields.geom.coordinates[0]
        
            var inside = false;
            for (var i = 0, j = box.length - 1; i < box.length; j = i++) {
                var xi = box[i][0], yi = box[i][1];
                var xj = box[j][0], yj = box[j][1];
        
                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
        
            return inside;
        };

        for(let i=0; i<614; i++) {

            try{
                
                let test = pointInPoly(testing[i]);
                if (test) {
                shownMarkers.push({
                    pos:[testing[i].fields.geom.coordinates[1], testing[i].fields.geom.coordinates[0]],
                    type: testing[i].fields.type,
                    add: testing[i].fields.siteaddress,
                    desc: testing[i].fields.descriptionofwork
                })

            }
            } catch(err){
            }
        }

        setNewMarker(shownMarkers);
    }
    
    //Call Async Function
    caller()

    }

    //onSubmit search function calls geocodify api then call initMap function
    const search = (event) => {

        event.preventDefault();

        let type = valueMode;
        let time = valueTime;

        fetch(`https://api.geocodify.com/v2/geocode?api_key=${geoKey}&q=${newInput}`)
        .then(res => res.json())
        .then(data => data.response.features[0].geometry.coordinates)
        .then(data => {initMap(type,time,data)})
        .catch(error => {
            //Show warning message for 3 seconds on error
            setWM(true)
            setNewInput('')
            setTimeout(()=>setWM(false),3000)
        });
    
        
    }


    return (
    <>
    {/* Using elastic page,sidebar and header modules */}
    <Header />

        <EuiPage>

            <EuiPageSideBar>

                {warningMessage ? ( 
                <EuiCallOut title="Unvalid location. Please try again." color="danger" iconType="alert" style={{marginBottom:'20px'}}> </EuiCallOut>
                ) : (<></>)}

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

                    <Map className={styles.leaflet} center={center} zoom={11} scrollWheelZoom={false} ref={mapRef} zoomSnap={0}>

                        <TileLayer url={tilesUrl} tileSize={512} crossOrigin="true" minZoom={6} zoomOffset={-1}/>

                        {source.map(data => (<Marker position={data}></Marker>))}
                        {polygon.map(data => (<Polygon color={data.color} positions={data.position} opacity="0" ></Polygon>))}
                        {markers.map(data => (
                            <Marker position={data.pos} icon={icon} riseOnHover="true">
                                <Popup className={styles.test}>
                                        <div className={styles.popup}>
                                        Type: {data.type} <br /> <br />
                                        Location: {data.add} <br /> <br />
                                        Description: {data.desc}
                                        </div>
                                </Popup>
                            </Marker>
                            ))}
                        
                    </Map>

    

                </EuiPageContent>

            </EuiPageBody>

        </EuiPage>

    </>

    )

}

export default App;
import React, {useState, useEffect} from 'react';

import '@elastic/eui/dist/eui_theme_light.css';
import styles from"./App.module.css";

import { Header,} from './components';

import {Map, TileLayer} from "react-leaflet";

import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageSideBar,
  } from '@elastic/eui';

import { tileLayer } from 'leaflet';


const App = () => {

    const mapKey = '7YdX4yPR0NXL8R9yqDyX';
    const mapAkey = 'AWVFN900CECDXH4S6HQC308181228';
    const geoKey = undefined;

    //defining basemap
    const tilesUrl = `https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}@2x.png?key=${mapKey}`;
  



    return (
    <>
    {/* Using elastic page,sidebar and header modules */}
    <Header />
        <EuiPage>
            <EuiPageSideBar>SideBar nav</EuiPageSideBar>
            <EuiPageBody component="div">
                <EuiPageContent>
                    {/* Importing leaflet map and baselayer */}
                    <Map className={styles.leaflet} center={[49.2827, -123.1207]} zoom={11}>
                        <TileLayer url={tilesUrl}/>
                    </Map>
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    </>

    )

}

export default App;
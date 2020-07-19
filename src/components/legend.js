import { useLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import './legend.css';

const Legend = () => {

  const { map } = useLeaflet();

  useEffect(() => {

    // legend colors
    const colors = ['rgb(0, 104, 55)', 'rgb(57, 181, 74)', 'rgb(140, 198, 63)', 'rgb(247, 147, 30)', 'rgb(241, 90, 36)', 'rgb(193, 39, 45)'];
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const times = [5, 10, 15, 20, 25, 30];
      let labels = [];
      let labelTime;

      for (let i = 0; i < times.length; i++) {
        labelTime = times[i];

        labels.push(
          '<i style="background:' +
            colors[i] +
            '"></i> ' +
            (labelTime === 5 ? + labelTime + " \xa0 Mins" : labelTime + " Mins") 
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);
  },[]);
  return null;
};

export default Legend;

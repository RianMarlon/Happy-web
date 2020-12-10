import L from 'leaflet';

import mapMarkerImg from '../assets/images/map-marker.svg';

const mapIcon = L.icon({
  iconUrl: mapMarkerImg,
  iconSize: [50, 60],
  iconAnchor: [25, 60],
  popupAnchor: [170, 8],
});

export default mapIcon;

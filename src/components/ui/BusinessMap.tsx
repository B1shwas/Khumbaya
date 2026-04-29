import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { Text } from "./Text";

interface BusinessMapProps {
  locationQuery: string;
  isApproximate?: boolean;
  zoom?: number;
  height?: number;
}

function parseCoords(query: string): { lat: number; lng: number } | null {
  const parts = query.split(",");
  if (parts.length === 2) {
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  return null;
}

function buildHTML(query: string, zoom: number): string {
  const coords = parseCoords(query);
  const initLat = coords ? coords.lat : 27.7172;
  const initLng = coords ? coords.lng : 85.324;

  const pinScript = coords
    ? `map.setView([${coords.lat},${coords.lng}],${zoom});
       L.marker([${coords.lat},${coords.lng}],{icon:icon}).addTo(map);`
    : `fetch('https://nominatim.openstreetmap.org/search?q='+encodeURIComponent(${JSON.stringify(query)})+'&format=json&limit=1')
       .then(function(r){return r.json()})
       .then(function(d){
         if(d&&d[0]){
           var lt=parseFloat(d[0].lat),ln=parseFloat(d[0].lon);
           map.setView([lt,ln],${zoom});
           L.marker([lt,ln],{icon:icon}).addTo(map);
         }
       }).catch(function(){});`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;background:#e5e7eb}
#map{position:absolute;top:0;left:0;right:0;bottom:0}
</style>
</head>
<body>
<div id="map"></div>
<script>
(function(){
  var L_CSS = document.createElement('link');
  L_CSS.rel = 'stylesheet';
  L_CSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(L_CSS);

  var L_JS = document.createElement('script');
  L_JS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  L_JS.onload = function() {
    var map = L.map('map', {
      zoomControl: true,
      attributionControl: false,
      fadeAnimation: false,
      markerZoomAnimation: false
    }).setView([${initLat}, ${initLng}], ${zoom});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a','b','c']
    }).addTo(map);

    var icon = L.divIcon({
      className: '',
      html: '<div style="width:24px;height:24px;background:#ee2b8c;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>',
      iconSize: [24,24], iconAnchor: [12,12]
    });

    ${pinScript}

    // Force full repaint after tiles start loading
    map.whenReady(function() {
      setTimeout(function(){ map.invalidateSize(true); }, 50);
      setTimeout(function(){ map.invalidateSize(true); }, 200);
    });
  };
  document.head.appendChild(L_JS);
})();
</script>
</body>
</html>`;
}

export default function BusinessMap({
  locationQuery,
  isApproximate = false,
  zoom = 13,
  height = 220,
}: BusinessMapProps) {
  return (
    <View style={{ height, width: "100%" }}>
      <WebView
        source={{ html: buildHTML(locationQuery, zoom), baseUrl: "https://www.openstreetmap.org" }}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
      />
      {isApproximate && (
        <View className="absolute top-2 left-2 flex-row items-center gap-1 px-2 py-1 rounded-full bg-black/50">
          <MaterialIcons name="info-outline" size={11} color="white" />
          <Text className="text-white text-[10px] font-semibold">Approximate location</Text>
        </View>
      )}
    </View>
  );
}

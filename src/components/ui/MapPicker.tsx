import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { WebView } from "react-native-webview";

interface MapPickerProps {
  latitude: string;
  longitude: string;
  onPick: (lat: string, lng: string) => void;
  height?: number;
}

function buildPickerHTML(lat: number, lng: number, hasPinLat?: number, hasPinLng?: number): string {
  const pinJS =
    hasPinLat != null && hasPinLng != null
      ? `var marker = L.marker([${hasPinLat}, ${hasPinLng}], { icon: pinIcon }).addTo(map);`
      : `var marker = null;`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:100%; height:100%; background:#e5e7eb; }
    #map { position:absolute; top:0; left:0; right:0; bottom:0; }
    #hint { position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
            background:rgba(0,0,0,0.55); color:#fff; font-size:11px;
            padding:5px 12px; border-radius:20px; white-space:nowrap; z-index:999;
            font-family:sans-serif; pointer-events:none; }
  </style>
</head>
<body>
<div id="map"></div>
<div id="hint">Tap to drop a pin</div>
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
    }).setView([${lat}, ${lng}], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a','b','c']
    }).addTo(map);

    var pinIcon = L.divIcon({
      className: '',
      html: '<div style="width:28px;height:28px;background:#ee2b8c;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
      iconSize: [28, 28], iconAnchor: [14, 28]
    });

    ${pinJS}

    map.on('click', function(e) {
      if (marker) { map.removeLayer(marker); }
      marker = L.marker(e.latlng, { icon: pinIcon }).addTo(map);
      document.getElementById('hint').style.display = 'none';
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'pick', lat: e.latlng.lat, lng: e.latlng.lng
      }));
    });

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

export default function MapPicker({ latitude, longitude, onPick, height = 200 }: MapPickerProps) {
  const parsedLat = latitude ? parseFloat(latitude) : 27.7172;
  const parsedLng = longitude ? parseFloat(longitude) : 85.324;
  const hasPinLat = latitude ? parsedLat : undefined;
  const hasPinLng = longitude ? parsedLng : undefined;

  return (
    <View
      style={{ height, width: "100%", borderRadius: 12, overflow: "hidden" }}
      className="border border-gray-100 shadow-sm"
    >
      <WebView
        source={{ html: buildPickerHTML(parsedLat, parsedLng, hasPinLat, hasPinLng), baseUrl: "https://www.openstreetmap.org" }}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        onMessage={(e) => {
          try {
            const data = JSON.parse(e.nativeEvent.data);
            if (data.type === "pick") {
              onPick(data.lat.toFixed(6), data.lng.toFixed(6));
            }
          } catch {}
        }}
      />
      <View className="absolute top-2 right-2 bg-white/90 rounded-lg px-2 py-1 flex-row items-center gap-1" style={{ elevation: 3 }}>
        <MaterialIcons name="touch-app" size={12} color="#ee2b8c" />
      </View>
    </View>
  );
}

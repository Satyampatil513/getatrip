// map-store.js
import { defineStore } from 'pinia';
import mapboxgl from 'mapbox-gl';

const modeColors = {
  flight: '#ef4444',
  train: '#10b981',
  car: '#3b82f6',
  ferry: '#8b5cf6'
};

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;

export const useMapStore = defineStore('map', {
  state: () => ({
    map: null,
    mapContainer: null
  }),
  actions: {
    initializeMap(container, trip) {
      this.mapContainer = container;
      
      this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [78.9629, 20.5937], // Default India center
        zoom: 4
      });
    
      this.map.on('load', async () => {
        this.addMarkers(trip.nodes);
        await this.addRoutes(trip.edges, trip.nodes);
        
        // Add custom UI elements
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        this.map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
      });
    },
    

    calculateCenter(nodes) {
      // Convert coordinate strings to numbers
      const coordinates = Object.values(nodes).map(node => [
        parseFloat(node.longitude),
        parseFloat(node.latitude)
      ]);
      
      // Sum up the coordinates numerically
      const avgLon = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
      const avgLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
      
      return [avgLon, avgLat];
    },
    

    addMarkers(nodes) {
      // Clear existing markers
      const markers = document.getElementsByClassName('map-marker');
      while (markers[0]) markers[0].parentNode.removeChild(markers[0]);
    
      const coordinates = [];
      Object.entries(nodes).forEach(([name, location], index) => {
        const lat = parseFloat(location.latitude);
        const lon = parseFloat(location.longitude);
        coordinates.push([lon, lat]);
        
        // Create marker element
        const el = document.createElement('div');
        el.className = `map-marker animate-pulse flex items-center justify-center 
                        w-8 h-8 rounded-full border-2 border-white shadow-lg 
                        ${index === 0 ? 'bg-emerald-500' : 'bg-indigo-500'}`;
        
        // Inner dot
        const dot = document.createElement('div');
        dot.className = 'w-2 h-2 bg-white rounded-full';
        el.appendChild(dot);
    
        // Popup content
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="min-w-[200px] p-3">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-indigo-500'}"></div>
              <h3 class="font-semibold text-gray-800">${name}</h3>
            </div>
            <div class="mt-2 text-sm text-gray-600">
              <p>📍 ${location.latitude}, ${location.longitude}</p>
            </div>
          </div>
        `);
    
        new mapboxgl.Marker(el)
          .setLngLat([location.longitude, location.latitude])
          .setPopup(popup)
          .addTo(this.map);
      });
    
      // Auto-fit map to markers
      if (coordinates.length > 0) {
        const bounds = coordinates.reduce((bounds, coord) => 
          bounds.extend(coord), new mapboxgl.LngLatBounds());
        
        this.map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 12,
          duration: 1000
        });
      }
    },

    createCustomMarker(color = '#4f46e5') {
      const el = document.createElement('div');
      el.className = 'marker animate-pulse';
      el.style.cssText = `
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      `;
      return el;
    },

    async addRoutes(edges, nodes) {
      // Clear existing routes
      this.map.getStyle().layers.forEach(layer => {
        if (layer.id.startsWith('route-layer')) {
          this.map.removeLayer(layer.id);
        }
      });

      Object.keys(this.map.getStyle().sources).forEach(sourceId => {
        if (sourceId.startsWith('route-')) {
          this.map.removeSource(sourceId);
        }
      });

      for (const [index, edge] of edges.entries()) {
        const fromLocation = nodes[edge.from];
        const toLocation = nodes[edge.to];

        if (!fromLocation || !toLocation) {
          console.error('Missing location data for edge:', edge);
          continue;
        }

        try {
          const profile = this.getTransportProfile(edge.mode);
          const coordinates = `${fromLocation.longitude},${fromLocation.latitude};${toLocation.longitude},${toLocation.latitude}`;
          const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?access_token=${mapboxgl.accessToken}&geometries=geojson`;

          const response = await fetch(url);
          const data = await response.json();

          if (data.routes && data.routes[0] && data.routes[0].geometry) {
            const sourceId = `route-${index}`;
            const layerId = `route-layer-${index}`;

            this.map.addSource(sourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: data.routes[0].geometry,
                properties: {}
              }
            });

            this.map.addLayer({
              id: layerId,
              type: 'line',
              source: sourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': modeColors[edge.mode.toLowerCase()] || '#6366f1',
                'line-width': 4,
                'line-opacity': 0.8
              }
            });
          }
        } catch (error) {
          console.error('Error adding route:', error);
        }
      }
    },

    getTransportProfile(mode) {
      const profiles = {
        flight: 'driving',
        train: 'driving',
        car: 'driving',
        ferry: 'driving'
      };
      return profiles[mode.toLowerCase()] || 'driving';
    },

    resizeMap() {
      if (this.map) this.map.resize();
    },

    removeMap() {
      if (this.map) this.map.remove();
    }
  }
});
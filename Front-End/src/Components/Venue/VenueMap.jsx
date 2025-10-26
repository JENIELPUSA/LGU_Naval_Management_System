import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Custom marker icon
const pinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

// Helper component for zooming programmatically
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 17, { duration: 1.5 });
  }, [position, map]);
  return null;
};

export default function VenueMap({ isEventUpcoming, mapRefLocate }) {
  const [coordsList, setCoordsList] = useState([]);
  const [flyTo, setFlyTo] = useState(null);
  const mapRef = useRef();

  // 🧭 Fetch event coordinates
  useEffect(() => {
    if (!isEventUpcoming || isEventUpcoming.length === 0) return;

    const fetchAllCoordinates = async () => {
      const newCoordsList = [];

      for (const event of isEventUpcoming) {
        if (!event.venue) continue;

        try {
          const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
              params: {
                q: event.venue,
                format: "json",
                addressdetails: 1,
                limit: 1,
              },
              headers: {
                "User-Agent": "LGU-Naval-EMS/1.0 (contact@lgu.gov.ph)",
              },
            }
          );

          if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            newCoordsList.push({
              lat: parseFloat(lat),
              lon: parseFloat(lon),
              title: event.proposal?.title || "Event",
              venue: event.venue,
              startTime: event.startTime,
            });
          } else {
            console.warn(`Address not found: ${event.venue}`);
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      }

      // ✅ Remove duplicate venues
      const uniqueList = newCoordsList.filter(
        (v, i, a) =>
          a.findIndex(
            (t) =>
              t.lat === v.lat &&
              t.lon === v.lon &&
              t.title === v.title &&
              t.venue === v.venue
          ) === i
      );

      setCoordsList(uniqueList);
    };

    fetchAllCoordinates();
  }, [isEventUpcoming]);

  // 👉 Scroll into view when triggered
  useEffect(() => {
    if (mapRefLocate && mapRefLocate.current) {
      mapRefLocate.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [mapRefLocate]);

  // 📍 Zoom when marker or card is clicked
  const handleZoom = (lat, lon) => {
    setFlyTo([lat, lon]);
  };

  return (
    <div
      ref={mapRefLocate}
      className="mx-auto w-11/12 overflow-hidden border border-white/30 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:w-3/4 md:w-full"
    >
      {/* Title */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Event Map
        </h2>
      </div>

      {/* Map */}
      {coordsList.length > 0 ? (
        <MapContainer
          center={[coordsList[0].lat, coordsList[0].lon]}
          zoom={14}
          className="h-72 w-full overflow-hidden rounded-3xl sm:h-96 md:h-[500px]"
          style={{ borderRadius: "1.5rem" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {coordsList.map((event, index) => (
            <Marker
              key={index}
              position={[event.lat, event.lon]}
              icon={pinIcon}
              eventHandlers={{
                click: () => handleZoom(event.lat, event.lon),
              }}
            >
              <Popup>
                <div className="text-left">
                  <p className="font-bold text-gray-800">{event.title}</p>
                  <p className="text-gray-600">Venue: {event.venue}</p>
                  {event.startTime && (
                    <p className="text-gray-600">
                      Starts at: {event.startTime}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          {flyTo && <FlyToLocation position={flyTo} />}
        </MapContainer>
      ) : (
        <div className="flex h-72 items-center justify-center overflow-hidden rounded-3xl text-gray-600 sm:h-96 md:h-[500px]">
          {isEventUpcoming?.length > 0
            ? "Loading map..."
            : "No upcoming events with venue data."}
        </div>
      )}

      {/* Horizontal scrolling ticker */}
      {coordsList.length > 0 && (
        <div className="mt-6 overflow-hidden">
          <div className="animate-scroll flex gap-6">
            {coordsList.map((event, index) => (
              <div
                key={index}
                onClick={() => handleZoom(event.lat, event.lon)}
                className="min-w-[250px] flex-shrink-0 cursor-pointer rounded-2xl border-2 border-transparent bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:border-blue-400"
              >
                <p className="font-bold text-gray-800">{event.title}</p>
                <p className="text-gray-600">{event.venue}</p>
                {event.startTime && (
                  <p className="text-gray-600">Starts at: {event.startTime}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
}

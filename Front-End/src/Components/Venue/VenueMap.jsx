import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const pinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 17, { duration: 1.5 });
  }, [position, map]);
  return null;
};

export default function VenueMapModal({ isOpen, onClose, isEventUpcoming }) {
  const [coordsList, setCoordsList] = useState([]);
  const [flyTo, setFlyTo] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (!isEventUpcoming || isEventUpcoming.length === 0) return;

    const fetchAllCoordinates = async () => {
      const newCoordsList = [];

      for (const event of isEventUpcoming) {
        if (!event.venue) continue;

        try {
          const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q: event.venue, format: "json", addressdetails: 1, limit: 1 },
            headers: { "User-Agent": "LGU-Naval-EMS/1.0 (contact@lgu.gov.ph)" },
          });

          if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            newCoordsList.push({
              lat: parseFloat(lat),
              lon: parseFloat(lon),
              title: event.proposal?.title || "Event",
              venue: event.venue,
              startTime: event.startTime,
            });
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      }

      const uniqueList = newCoordsList.filter(
        (v, i, a) =>
          a.findIndex((t) => t.lat === v.lat && t.lon === v.lon && t.venue === v.venue) === i
      );

      setCoordsList(uniqueList);
    };

    fetchAllCoordinates();
  }, [isEventUpcoming]);

  const handleZoom = (lat, lon) => setFlyTo([lat, lon]);

  // Voice command handler for closing the map
  useEffect(() => {
    if (!isOpen) return;

    const handleVoiceCommand = (event) => {
      const command = event.detail?.command?.toLowerCase().trim();
      if (!command) return;

      console.log(`🗺️ Map Close Command: "${command}"`);

      // Close command for the map
      if (
        command.includes("close map") || 
        command.includes("isara ang mapa") || 
        command.includes("isara mapa") ||
        command.includes("close the map") ||
        command.includes("exit map") ||
        command.includes("map close")
      ) {
        onClose();
        // You can also trigger a speech feedback if needed
        window.dispatchEvent(new CustomEvent("speak-text", { 
          detail: { text: "Closing map" } 
        }));
      }
    };

    window.addEventListener("voice-command", handleVoiceCommand, { capture: true });
    
    return () => {
      window.removeEventListener("voice-command", handleVoiceCommand, { capture: true });
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative mx-4 w-full max-w-5xl rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-red-500 px-2 py-1 text-white hover:bg-red-600"
            >
              ✕
            </button>

            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
              Event Map - Say "close map" to exit
            </h2>

            {coordsList.length > 0 ? (
              <MapContainer
                center={[coordsList[0].lat, coordsList[0].lon]}
                zoom={14}
                className="h-96 w-full rounded-xl"
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
                    eventHandlers={{ click: () => handleZoom(event.lat, event.lon) }}
                  >
                    <Popup>
                      <div className="text-left">
                        <p className="font-bold text-gray-800">{event.title}</p>
                        <p className="text-sm text-gray-600">Venue: {event.venue}</p>
                        {event.startTime && (
                          <p className="text-sm text-gray-600">
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
              <div className="flex h-96 items-center justify-center rounded-xl text-gray-600">
                {isEventUpcoming?.length > 0
                  ? "Loading map..."
                  : "No upcoming events with venue data."}
              </div>
            )}


            {/* Voice Command Hint */}
            <div className="mt-3 rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-800">
              <p>💡 <strong>Voice Command:</strong> Say "close map" or "isara ang mapa" to exit</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
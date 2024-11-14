"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Device } from "@/types/common";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface MapProps {
  devices: Device[];
}

const Map = ({ devices }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [devices[0]?.longitude || 0, devices[0]?.latitude || 0],
      zoom: 5,
    });

    devices.forEach((device) => {
      new mapboxgl.Marker()
        .setLngLat([device.longitude, device.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(`<h3>${device.location_name}</h3>`)
        )
        .addTo(map);
    });

    return () => map.remove();
  }, [devices]);

  return <div ref={mapContainerRef} className="w-full h-64" />;
};

export default Map;

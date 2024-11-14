// types/common.ts
export interface Device {
    device_id: string;
    location_name: string;
    latitude: number;
    longitude: number;
  }
  
  export interface Reading {
    timestamp: string;
    fullness_level: number;
  }
  
  export interface AverageFullness {
    device_id: string;
    average_fullness: number;
  }

  export interface AlertDevice extends Device {
    fullness_level: number;
  }
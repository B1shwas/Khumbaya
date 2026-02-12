export interface LocationFormData {
  city: string;
  address: string;
  venueName: string;
  latitude: number | null;
  longitude: number | null;
}

export const DEFAULT_LOCATION_DATA: LocationFormData = {
  city: "",
  address: "",
  venueName: "",
  latitude: null,
  longitude: null,
};

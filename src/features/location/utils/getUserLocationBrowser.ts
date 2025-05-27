const getLocationPromise = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getUserLocationBrowser = async () => {
  if (navigator.geolocation) {
    const location = await getLocationPromise();
    return {
      success: true,
      data: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };
  }
  console.warn(`Browser geolocation is not supported`);
  return {
    success: false,
    data: {},
  };
};

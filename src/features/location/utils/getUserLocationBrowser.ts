'use client';

type BrowserLocationResult =
  | {
      success: true;
      data: {
        latitude: number;
        longitude: number;
      };
    }
  | {
      success: false;
      error: string;
    };

const getLocationPromise = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getUserLocationBrowser =
  async (): Promise<BrowserLocationResult> => {
    if (!navigator.geolocation) {
      return {
        success: false,
        error: 'Browser geolocation is not supported.',
      };
    }

    const location = await getLocationPromise();
    return {
      success: true,
      data: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };
  };

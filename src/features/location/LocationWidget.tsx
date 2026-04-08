'use client';

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Card, CardContent } from '@yaip/yads-ui';

interface Props {
  latitude: number;
  longitude: number;
}

const LazyLocationWidgetMap = lazy(() => import('./LocationWidgetMap'));

function LocationWidgetFallback() {
  return (
    <div className="h-50 w-full rounded-lg bg-slate-200/40 dark:bg-slate-800/60" />
  );
}

function LocationWidget({ latitude, longitude }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card className="w-full max-w-xl bg-card/68 shadow-sm ring-border/45 backdrop-blur-xl">
      <CardContent className="pt-1">
        {isMounted ? (
          <Suspense fallback={<LocationWidgetFallback />}>
            <LazyLocationWidgetMap latitude={latitude} longitude={longitude} />
          </Suspense>
        ) : (
          <LocationWidgetFallback />
        )}
      </CardContent>
    </Card>
  );
}

export default LocationWidget;
export { LocationWidget };

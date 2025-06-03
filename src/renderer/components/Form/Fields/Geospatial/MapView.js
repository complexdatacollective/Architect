import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-unminified';
import { useSelector } from 'react-redux';
import { Layout, Section } from '@components/EditorLayout';
import { AnimatePresence, motion } from 'framer-motion';
import ControlBar from '@components/ControlBar';
import Screen from '@components/Screen/Screen';
import Button from '@codaco/ui/lib/components/Button';
import { screenVariants } from '@components/Screens/Screens';
import { get } from 'lodash';
import { getAssetManifest } from '@selectors/protocol';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapView = ({ mapOptions, onChange, close }) => {
  const { tokenAssetId, style } = mapOptions;
  const assetManifest = useSelector(getAssetManifest);
  const mapboxAPIKey = get(assetManifest, [tokenAssetId, 'value'], '');

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const [center, setCenter] = useState(mapOptions.center || [0, 0]);
  const [zoom, setZoom] = useState(mapOptions.initialZoom || 0);

  const saveMapSelection = (newCenter, newZoom) => {
    onChange({
      ...mapOptions,
      center: newCenter,
      initialZoom: newZoom,
    });
  };

  const cancelButton = (
    <Button
      color="platinum"
      onClick={() => close()}
      key="cancel"
    >
      Cancel
    </Button>
  );

  const saveButton = (
    <Button
      color="primary"
      onClick={() => {
        saveMapSelection(center, zoom);
        close();
      }}
      key="save"
      iconPosition="right"
      icon="arrow-right"
    >
      Save Changes
    </Button>
  );

  const isMapChanged = center !== mapOptions.center || zoom !== mapOptions.initialZoom;

  const controlButtons = [
    cancelButton,
    ...(isMapChanged ? [saveButton] : []),
  ];

  useEffect(() => {
    if (!mapboxAPIKey || !mapContainerRef.current) {
      return;
    }

    mapboxgl.accessToken = mapboxAPIKey;

    const initializeMap = () => {
      if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: style || 'mapbox://styles/mapbox/streets-v12',
          center,
          zoom,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl({
          showCompass: false,
        }));

        mapRef.current.on('move', () => {
          const mapCenter = mapRef.current.getCenter();
          const mapZoom = mapRef.current.getZoom();

          setCenter([mapCenter.lng, mapCenter.lat]);
          setZoom(mapZoom);
        });
      }
    };

    initializeMap();

    // eslint-disable-next-line consistent-return
    return () => {
      mapRef.current?.remove();
    };
  }, [mapOptions, mapboxAPIKey]);

  return (
    <AnimatePresence>
      <motion.div
        variants={screenVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="screens-container"
      >
        <Screen
          header={(
            <div className="stage-heading stage-heading--collapsed stage-heading--shadow">
              <Layout>
                <h2>Initial Map View</h2>
              </Layout>
            </div>
        )}
          footer={(
            <ControlBar
              buttons={controlButtons}
            />
        )}
        >
          <Layout>
            <Section
              title="Set Initial Map View"
              summary={(
                <p>
                  Pan and zoom the map below to configure the initial view.

                  When the map is first loaded, it will be centered at the
                  initial center and zoom level as it appears here.
                  Resetting the map will return it to this view.
                </p>
          )}
            >
              <div ref={mapContainerRef} style={{ width: '100%', height: '50vh' }} />
            </Section>
          </Layout>
        </Screen>
      </motion.div>
    </AnimatePresence>
  );
};

MapView.defaultProps = {
  mapOptions: {
    center: [0, 0],
    tokenAssetId: '',
    initialZoom: 0,
    dataSourceAssetId: '',
    color: '',
    targetFeatureProperty: '',
    style: '',
  },
};

MapView.propTypes = {
  mapOptions: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number),
    tokenAssetId: PropTypes.string,
    initialZoom: PropTypes.number,
    dataSourceAssetId: PropTypes.string,
    color: PropTypes.string,
    targetFeatureProperty: PropTypes.string,
    style: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default MapView;

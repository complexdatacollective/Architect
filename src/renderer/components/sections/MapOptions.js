import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import withDisabledAPIKeyRequired from '@components/enhancers/withDisabledAPIKeyRequired';
import NativeSelect from '@components/Form/Fields/NativeSelect';

import withMapFormToProps from '@components/enhancers/withMapFormToProps';
import { Section, Row } from '../EditorLayout';
import ValidatedField from '../Form/ValidatedField';

import ColorPicker from '../Form/Fields/ColorPicker';
import GeoDataSource from '../Form/Fields/Geospatial/GeoDataSource';
import GeoAPIKey from '../Form/Fields/Geospatial/GeoAPIKey';
import MapSelection from '../Form/Fields/Geospatial/MapSelection';
import useVariablesFromExternalData from '../../hooks/useVariablesFromExternalData';

import ExternalLink from '../ExternalLink';

const mapboxStyleOptions = [
  { label: 'Standard', value: 'mapbox://styles/mapbox/standard' },
  { label: 'Standard Satellite', value: 'mapbox://styles/mapbox/standard-satellite' },
  { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v12' },
  { label: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v12' },
  { label: 'Light', value: 'mapbox://styles/mapbox/light-v11' },
  { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v11' },
  { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
  { label: 'Satellite Streets', value: 'mapbox://styles/mapbox/satellite-streets-v12' },
  { label: 'Navigation Day', value: 'mapbox://styles/mapbox/navigation-day-v1' },
  { label: 'Navigation Night', value: 'mapbox://styles/mapbox/navigation-night-v1' },
];

const MapOptions = (props) => {
  const { mapOptions, disabled } = props;

  const { variables: variableOptions } = useVariablesFromExternalData(mapOptions?.dataSourceAssetId, true, 'geojson');

  const { paletteName, paletteSize } = { paletteName: ['ord-color-seq'], paletteSize: 8 };

  return (
    <>
      <Section
        title="API Key"
        summary={(
          <p>
            This interface requires an API key from Mapbox.
            For more information about Mapbox and retreiving an API Key,
            read our
            {' '}
            <ExternalLink
              href="https://documentation.networkcanvas.com/interface-documentation/geospatial/"
            >
              documentation
            </ExternalLink>
            {' '}
            on the interface.
          </p>
    )}
      >
        <div data-name="Map Options Mapbox Key" />
        <ValidatedField
          name="mapOptions.tokenAssetId"
          component={GeoAPIKey}
          label="Mapbox API Key"
          validation={{ required: true }}
        />
      </Section>
      <Section
        title="Data source for map layers"
        summary={(
          <p>
            This interface requires a GeoJSON source for map layers.
            These provide selectable areas for prompts. Select a GeoJSON
            file to use.
          </p>
            )}
      >
        <Row>
          <div data-name="Layer data-source" />
          <ValidatedField
            component={GeoDataSource}
            name="mapOptions.dataSourceAssetId"
            id="dataSourceAssetId"
            validation={{ required: true }}
          />
        </Row>
        {variableOptions && variableOptions.length > 0 && (
          <Row>
            <ValidatedField
              label="Which property should be used for map selection?"
              name="mapOptions.targetFeatureProperty"
              component={NativeSelect}
              options={variableOptions}
              validation={{ required: true }}
            />
          </Row>
        )}
      </Section>
      <Section
        title="Map Style"
      >
        <Row>

          <ValidatedField
            component={ColorPicker}
            name="mapOptions.color"
            palette={paletteName}
            paletteRange={paletteSize}
            validation={{ required: true }}
            label="Which color would you like to use for this stage's map outlines and selections?"
          />
        </Row>
        <Row>

          <ValidatedField
            component={NativeSelect}
            name="mapOptions.style"
            options={mapboxStyleOptions}
            validation={{ required: true }}
            label="Which mapbox style would you like to use for the map itself?"

          />
        </Row>
      </Section>
      <Section
        title="Initial Map View"
        summary={(
          <p>
            Configure the initial map view to adjust where it will be centered and zoomed to.
          </p>
            )}
        disabled={disabled}
      >
        <ValidatedField
          name="mapOptions"
          component={MapSelection}
          label="Initial Map View"
          validation={{ required: true }}
        />
      </Section>
    </>

  );
};
MapOptions.defaultProps = {
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

MapOptions.propTypes = {
  mapOptions: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number),
    tokenAssetId: PropTypes.string,
    initialZoom: PropTypes.number,
    dataSourceAssetId: PropTypes.string,
    color: PropTypes.string,
    targetFeatureProperty: PropTypes.string,
    style: PropTypes.string,
  }),
  disabled: PropTypes.bool.isRequired,
};

export default compose(
  withMapFormToProps(['mapOptions']),
  withDisabledAPIKeyRequired,
)(MapOptions);

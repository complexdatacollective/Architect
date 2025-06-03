import { withProps } from 'recompose';

const withDisabledAPIKeyRequired = withProps(({ mapOptions }) => {
  const tokenAssetId = mapOptions && mapOptions.tokenAssetId;
  return { disabled: !tokenAssetId };
});

export default withDisabledAPIKeyRequired;

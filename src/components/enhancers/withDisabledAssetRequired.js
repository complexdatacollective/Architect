import { withProps } from 'recompose';

const withDisabledAssetRequired = withProps(({ dataSource }) => ({ disabled: !dataSource }));

export default withDisabledAssetRequired;

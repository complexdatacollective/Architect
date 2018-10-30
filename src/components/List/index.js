/**
 * Usage
 *         <SortedList
          items={varibles}
          filter={parameters => variable => variable.name === parameters.query}
          sorter={}
          component={({ item, index }) => (
            <Variable
              fieldId={`${name}[${index}]`}
              form={form}
              {...item}
            />
          )}
        />
 */

import List from './List';
import Controls from './Controls';

export { Controls };

export default List;

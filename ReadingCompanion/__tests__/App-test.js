/**
 * @format
 */

import 'react-native';
import React from 'react';
import { MillisToDisplayDate, DisplayDateToMillis } from '../util/DateUtil';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   renderer.create(<App />);
// });

test('MillisToDisplayDate', () => {
  fourthOfJuly = new Date(2019, 6, 4);
  expect(MillisToDisplayDate(fourthOfJuly.getTime())).toBe("07-04-2019");
});

test('DisplayDateToMillis', () => {
  fourthOfJuly = new Date(2019, 6, 4);
  expect(DisplayDateToMillis("07-04-2019")).toBe(fourthOfJuly.getTime());
});

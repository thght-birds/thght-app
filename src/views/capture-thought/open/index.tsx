import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomNavigationLayout from '../../../Layouts/BottomNavigationLayout';

const styles = StyleSheet.create({
  hello: {
    fontSize: 30,
    color: 'white',
  },
});

const CaptureThought: React.SFC = (): JSX.Element => (
  <BottomNavigationLayout>
    <View>
      <Text style={styles.hello}>CaptureThought</Text>
    </View>
  </BottomNavigationLayout>
);

export default CaptureThought;

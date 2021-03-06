import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-native';
import { Route, routes } from '../../constants/routes';

const styles = StyleSheet.create({
  navigation: {
    flex: 1,
    flexDirection: 'row',
  },
  navigationItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  link: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    color: 'blue',
  },
  nonActive: {
    color: 'black',
  },
});

const BottomNavigation: React.SFC = () => {
  return (
    <View style={styles.navigation}>
      {routes
        .filter((route: Route) => route.type === 'bottom')
        .map((route: Route) => (
          <View key={route.link} style={styles.navigationItem}>
            <Link to={route.link} style={styles.link}>
              <Text
                style={useLocation().pathname === route.link ? styles.active : styles.nonActive}
              >
                {route.name}
              </Text>
            </Link>
          </View>
        ))}
    </View>
  );
};

export default BottomNavigation;

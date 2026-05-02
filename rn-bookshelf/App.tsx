import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import BootstrapProvider from './src/components/BootstrapProvider';

const App = () => (
  <Provider store={store}>
    <BootstrapProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <AppNavigator />
    </BootstrapProvider>
  </Provider>
);

export default App;

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { PC_IPV4_ADDRESS } from '@env';

export default function App() {
  const [error, setError] = useState(null);

  return (
    <View style={styles.container}>
        <Text>overview screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

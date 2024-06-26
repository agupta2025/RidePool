import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import RideList from "../components/RideList"

export default function App() {
  const [currentRides, setCurrentRides] = useState(null)

  const navigation = useNavigation();


  return (
    <ScrollView style={styles.container}>
      <View style={styles.listContainer}>
        <Button mode="outlined" onPress={() => navigation.navigate('Filter Ridepools', {
          setCurrentRides: setCurrentRides,
        })}>
          Filter Ridepools
        </Button>
      </View>   

      <View style={styles.listContainer}>
        <Text style={styles.label}>Search Results</Text>
      </View>

      {currentRides != null ?
        <RideList displayRelationship={true} rides={currentRides}  /> : (<></>)
      }

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff"
  },
  listContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 20
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between', 
  },
  dateTime: {
    marginBottom: 10,
  },
});
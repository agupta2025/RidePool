import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Switch, Card, Text, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import { SERVER_IPV4_ADDRESS, SERVER_PORT } from '@/config.js'; // from '@env';
import { useNavigation } from '@react-navigation/native';
import RideList from "../components/RideList"

import { saveToken, fetchToken } from '../components/token_funcs';
import { sendAuthorizedGetRequest, sentAuthorizedGetRequest } from '../components/sendRequest'

export default function App() {

  const handleSaveToken = async (token) => {
    await saveToken(newToken);
  };

  const handleFetchToken = async () => {
    return await fetchToken();
  };

  const [error, setError] = useState(null);
  const [currentRides, setCurrentRides] = useState(null)
  const [historyRides, setHistoryRides] = useState(null)

  const navigation = useNavigation();

  useEffect(() => {
    
    getUserRides('current', setCurrentRides);
    getUserRides('history', setHistoryRides);

    // testing here
    sendAuthorizedGetRequest('/profile').then(response => {
      console.log(response.data)
    })

  }, []);


  const getUserRides = async (time, setWhat) => {
    let token = await handleFetchToken();

    try {
      console.log("sending request with token " + token)
      console.log(`http://${SERVER_IPV4_ADDRESS}:${SERVER_PORT}/users/rides`) 
      const response = await axios.post(`http://${SERVER_IPV4_ADDRESS}:${SERVER_PORT}/users/rides`, {
        'time' : time
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
      console.log("USER RIDES: ")
      console.log(response.data)

      response.data['created_rides'].forEach(ride => {
        ride.relationship = 'creator';
      });
      response.data['member_rides'].forEach(ride => {
        ride.relationship = 'member';
      });
      response.data['requested_rides'].forEach(ride => {
        ride.relationship = 'requester';
      });
      let _ = response.data['created_rides'].concat(response.data['member_rides'])
      setWhat(_.concat(response.data['requested_rides']))


    } catch (err) {
      console.error('Error fetching data IN MY RIDEPOOLS:', err);
      setError(err);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.listContainer}>
        <Button mode="outlined" onPress={() => navigation.navigate('Create Ridepool')}>
          Create Ridepool
        </Button>
      </View>   

      <View style={styles.listContainer}>
        <Text style={styles.label}>Active</Text>
      </View>

      {currentRides != null ? <RideList displayRelationship = {true} rides = {currentRides}/> : (<></>)}

      <View style={styles.listContainer}>
        <Text style={styles.label}>History</Text>
      </View>

      {historyRides != null ? <RideList displayRelationship = {true} rides = {historyRides}/> : (<></>)}
      
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
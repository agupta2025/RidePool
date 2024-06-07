import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Text, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';

import { sendAuthorizedPostRequest } from "../components/sendRequest"

const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`
    );
    // console.log("OSM DATA FOR REVERSE GEOCODE")
    // console.log(response.data)
    return response.data.display_name.split(',')[0]; // Get the first part of the display name
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return `${latitude}, ${longitude}`; // Fallback to coordinates if reverse geocoding fails
  }
};

const RideCard = ({ ride, displayRelationship }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      const pickup = await reverseGeocode(ride.pickupLatitude, ride.pickupLongitude);
      const destination = await reverseGeocode(ride.destinationLatitude, ride.destinationLongitude); // Assuming destination coordinates exist
      setPickupLocation(pickup);
      setDestinationLocation(destination);
    };

    if (ride) {
      fetchLocations();
    }
  }, [ride]);

  if (!ride) {
    return null;
  }

  let status;
  if (displayRelationship) {
    if (ride.relationship === "creator") {
        status = "Created by You";
    } else if (ride.relationship === "member") {
        status = "You're a member";
    } else if (ride.relationship === "requester") {
        status = "Request Pending";
    }
    }
    const [currentRides, setCurrentRides] = useState(null)
    const [requested, setRequested] = useState(false);
    const onLeave = async (rideId) => {
      try {
        await sendAuthorizedPostRequest(`/rides/${rideId}/leave`);
      } catch (err) {
        console.error('Error leaving ride: ', err);
      }
    };

    const handleRequest = () => {
      setRequested(true);
    };

    const unRequest = () => {
      setRequested(false);
    }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style = {styles.locations}>{pickupLocation} to {destinationLocation}</Text>
        {displayRelationship ? (<Paragraph style={styles.italics}>{status}</Paragraph>) : (<></>) }
        <Paragraph>{ride.members.length} / {ride.maxGroupSize} riders</Paragraph>
        <Paragraph>Description: {ride.description.substring(0, 50)}...</Paragraph>
        {(ride.relationship !== "member" && ride.relationship !== "creator") &&(
        <View style={styles.buttonContainer}>
          {requested ? (
            <>
              <Button mode="contained" disabled>
                Requested
              </Button>
              <Button mode="contained" onPress={unRequest}>
                Leave
              </Button>
            </>
          ) : (
            <Button mode="contained" onPress={handleRequest}>
              Request
            </Button>
          )}
        </View>
        )}
      </Card.Content>
      {ride.relationship === "member" && (
        <Card.Actions>
          <Button mode="contained" onPress={() => onLeave(ride.rideId)}>Leave</Button>
        </Card.Actions>
      )}
    </Card>
  );
};

export default RideList = ({ rides, displayRelationship }) => {
  return (
    <>
      {rides != null ? (
        <ScrollView style={styles.container}>
          {rides.map(ride => (
            <RideCard key={ride.rideId} ride={ride} displayRelationship={displayRelationship} />
          ))}
        </ScrollView>
      ) : (
        <></>
      )}
    </>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  locations: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  listContainer: {
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
  },
  italics: {
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  }
});

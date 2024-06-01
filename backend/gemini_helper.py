from config import db
from models import User, Ride
import google.generativeai as genai
from flask import request
from geopy.distance import geodesic
from collections import Counter

from geolocation import get_location


genai.configure(api_key = 'AIzaSyDYF9j18membMdiL1M_8Fc46b333A9RHHw')
model = genai.GenerativeModel('gemini-1.5-flash-latest')

def get_user_count():
    try:
        user_count = User.query.count()
        return user_count
    except Exception as e:
        print(f"Error while rerieving user count: {str(e)}")
        return None
    
def get_ride_count():
    try:
        ride_count = Ride.query.count()
        return ride_count
    except Exception as e:
        print(f"Error while rerieving user count: {str(e)}")
        return None

def get_last_created_ride():
    last_ride = Ride.query.order_by(Ride.earliest_pickup_time.desc()).first()
    output = f"{last_ride} at {last_ride.earliest_pickup_time} with description: {last_ride.description}"
    return output

def get_closest_ride():
    all_rides = Ride.query.all()
    closest_ride = None
    min_distance = float('inf')
    lat_lng = get_location()
    latitude = lat_lng['location']['lat']
    longitude = lat_lng['location']['lng']

    for ride in all_rides:
        ride_location = (ride.pickup_latitude, ride.pickup_longitude)
        user_location = (latitude, longitude)
        distance = geodesic (user_location, ride_location).miles
        if distance < min_distance:
            min_distance = distance
            closest_ride = ride

    return closest_ride

def get_busiest_day():
    rides = Ride.query.all()
    weekdays = [ride.earliest_pickup_time.weekday() for ride in rides]

    weekday_counter = Counter(weekdays)
    weekday_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    busiest_day_index = weekday_counter.most_common(1)[0][0]
    busiest_day_name = weekday_names[busiest_day_index]

    return busiest_day_name

PRESET_RESPONSES = [
    f"We currently have {str(get_user_count())} users",
    f"We have {str(get_ride_count())} rides available",
    f"The last ride created was {str(get_last_created_ride())}",
    f"The closest ride to you is {str(get_closest_ride())}",
    f"The busiest day is {str(get_busiest_day())}"
]

def query_gemini_ai(query, preset_responses):
    prompt = f"{query}, choose between these responses --> {','.join(preset_responses)}. Choose only between these answers nothing else, sorry I do not know should only be picked if none of the other answers pertain"
    response = model.generate_content(prompt)
    content_parts = response._result.candidates[0].content.parts
    text_content = [part.text for part in content_parts]
    
    return text_content

def choose_best_response(user_query):
    gemini_response = query_gemini_ai(user_query, PRESET_RESPONSES)
    return gemini_response








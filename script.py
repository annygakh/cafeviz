import requests


# foursquare options
ubc_lat = "49.2611"
ubc_long = "-123.2531"
ubc_latlng = ubc_lat + "," + ubc_long
time_options = "&time=any"
day_options = '&day=any'
CLIENT_ID = 'KPS2K54XLQM1G4JVL3DBMZ0CQTZKEAIMYIC5UHCVR0NI2KRM'
CLIENT_SECRET = 'OHO4BCL1FHIGBA0PXGFEJDRQBAEPPBX3L2WJ43HNBXCGH4RZ'
type = '&section=food'
VERSION = "20130815"
api = 'explore?'
radius = '&radus=' + "10000"
limit = '&limit=' + "50"
URL = 'https://api.foursquare.com/v2/venues/' + api

options = {
			"ll": ubc_latlng, 
			"time":"any", "day": "any", "section":"food",
			"limit" : "50", 
			"client_id": CLIENT_ID, "client_secret":CLIENT_SECRET,
			"v":VERSION
			}
request = requests.get(URL, params=options)
print URL
# print request.json()

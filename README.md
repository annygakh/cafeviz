Name: Cafeviz
Concept: Interactive heatmap of restaraunts 
where the weight is determined by the
rating of the restaraunt. 
Toolkit: Javascript, Google Maps, Foursquare
Take a look: Source code, detailed description 
Date: April 2015  


Background: After seeing multiple data visualization projects
online, I wanted to give such type of projects a try. I figured 
it would be interesting to see which regions have high rated 
restaraunts and in future, incorporate other relevant 
datasets such as population data, and attempt to find 
whether there is a correlation between them.

What I did: I completed this project from scratch. With the 
help of Google Map code demos, it was easy to work with
the map, plot markers and add a heatmap layer. 

How it works: Whenever a user drags the map to a new area, 
an ajax request is sent to Foursquare, with the latitude and 
longitude of the center of the map. When the response is
received, it is parsed - latitude, longitude, name, hours
open and rating of each place is extracted. Each marker 
has a latitude, longitude, and weight - rating attributes.
In additon, each marker has a listener, that listens for click
events on the marker, and displays a tiny information window
with name, rating and open hours of the restaraunt. 
 

# Description #

A github contribution activity clone for streamers. This is tailored towards those who stream on youtube and want to keep track of their activity.
The app requires your youtube api key as well as an channel id key.

# How the app works #
The app uses the CalendarHeatmap library to create a github heatmap that takes in an object of form 
> { date: '2023-01-01', count: 3 }

Using the GET command, the upload date of live videos is grabbed as well as the duration of each video.
Each green shade represents a 2 hour increment up to 10 hours. with 10 hours being the darkest.

In addtion, I created a date filter so that it only uses a range of dates. From x to present. The app then takes the week of the first date and uses that as the first column of squares. 


# The app is build based off of the Create React App command #

> npx create-react-app my-app

To start the app local server
> Npm start






![Heatmap Example](https://github.com/deonneon/streamheatmap/example_heatmap.png)

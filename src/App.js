import "./App.css";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // Assume getContributionData is a function that retrieves the contributions
  // The contribution object looks like { date: '2023-01-01', count: 3 }
  //const contributions = getContributionData();

  // Generate last 60 days contributions data
  const [videoData, setVideoData] = useState([]);

  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  const channelId = process.env.REACT_APP_CHANNEL_ID;

  const videoDataForHeatmap = Object.keys(videoData).map((date) => ({
    date,
    count: videoData[date],
  }));

  useEffect(() => {
    // Function to convert ISO8601 duration to minutes
    const convertISO8601ToMinutes = (duration) => {
      let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

      if (!match) {
        return 0;
      }

      let hours = parseInt(match[1]) || 0;
      let minutes = parseInt(match[2]) || 0;

      return hours * 60 + minutes;
    };

    const fetchVideos = async () => {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=100`
      );

      const videoIds = response.data.items
        .filter((item) => item.id.kind === "youtube#video")
        .map((item) => item.id.videoId);

      const detailsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(
          ","
        )}&key=${apiKey}&part=contentDetails,snippet`
      );

      //Only use data from after a certain date. 
      const startDate = '2023-01-01';

      const data = detailsResponse.data.items.map((item) => {
        const durationInMinutes = convertISO8601ToMinutes(
          item.contentDetails.duration
        );
        const uploadDate = new Date(item.snippet.publishedAt)
          .toISOString()
          .split("T")[0];
      
        // round the count value here
        return { date: uploadDate, count: durationInMinutes / 120 };
      }).filter(item => item.date >= startDate);

      const groupedData = data.reduce((acc, video) => {
        if (!acc[video.date]) {
          acc[video.date] = 0;
        }
        acc[video.date] += video.count;
        return acc;
      }, {});

      for (let key in groupedData) {
        groupedData[key] = Math.round(groupedData[key]);
      }

      setVideoData(groupedData);
    };

    fetchVideos();
  }, [apiKey, channelId]);

  // find the earliest date in your dataset
  let earliestDate = Object.keys(videoData)[0];
  for (let date in videoData) {
    if (date < earliestDate) {
      earliestDate = date;
    }
  }

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="heatmap">
        <CalendarHeatmap
          startDate={new Date(earliestDate)}
          endDate={new Date()}
          values={videoDataForHeatmap}
          classForValue={(value) => {
            if (!value) {
              return "color-empty";
            }
            return `color-github-${value.count}`;
          }}
          showWeekdayLabels={true}
          horizontal={true}
          showOutOfRangeDays={true}
        />
      </div>
      {/*
      <div>
        {Object.keys(videoData).sort().map(date => (
          <div key={date}>
            <p>Date: {date}</p>
            <p>Counts: {videoData[date]}</p>
          </div>
        ))}
      </div>
        */}
    </div>
  );
}

export default App;

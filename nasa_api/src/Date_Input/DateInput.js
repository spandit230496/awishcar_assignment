import React, { useState } from "react";
import input from "./input.css";
import moment from "moment/moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChartVisualization from "../Data_visualisation/ChartVisualization";
import { Line } from "react-chartjs-2";
import rocket from '../assets/giphy rocket.gif'
import { PolarArea } from "react-chartjs-2";
import axios from 'axios';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
  
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
  
);
const DateInput = () => {
  const [startdate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [enddate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [dates,setDates]=useState({
          "startdate":startdate,
          "enddate":enddate
        })
        const [error, setError] = useState("");
        const [chart, setChart] = useState({});
  const [loading, setLoading] = useState(false);
  const [show ,setShow]=useState(false);
  const [fetchedData,setFetchedData]=useState()
  const [data, setData] = useState({
    closest: "",
    fastest: "",
    average: "",
  });
  const fetchData = () => {
    axios.post('http://localhost:5000/data', dates)
    .then((response) => {
      console.log(response.data);
      // Handle the response here
    })
    .catch((error) => {
      console.error(error.message);
      // Handle errors here
    });
       const timediff = (
        new Date(enddate).getTime()-new Date(startdate).getTime() 
      );
      const today = moment(new Date()).format("YYYY-MM-DD");
      const diffdays = timediff / (1000 * 3600 * 24);
      console.log(timediff, today, diffdays);
      
      if (diffdays > 7) {
        setError("Date range should not be greater than 7 days");
        toast("Date range should not be greater than 7 days");
        return;
    } else if (diffdays === 0) {
      setError("end date can't be same as start date ");
      toast("end date can't be same as start date ");
      return;
    } else if (end === today) {
      setError("end date can't be same as today ");
      toast("end date can't be same as today ");
      return;
    }
    else if (diffdays < 0) {
      console.log(diffdays)
      setError("start date can't be before end date ");
      toast("start date can't be before end date ");
      return;}
    setError("");
    setLoading(true);
    const url = "http://localhost:5000/backenddata";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.near_earth_objects)
        setFetchedData(data)
        setLoading(false);
        console.log( "data =======>"+JSON.stringify(fetchedData));
        const dates = Object.keys(data.near_earth_objects)
          .map((date) => new Date(date))
          .sort((a, b) => a - b) // Sort dates in ascending order
          .map((date) => date.toISOString().split("T")[0]);
        console.log(dates);

        const asteroidCount = [];
        let fastestAsteroid = [];
        let closestAsteroid = [];
        let avgSizeOfAsteroid = [];

        dates.forEach((date) => {
          // getting the count of asteroids on a date
          let count = data.near_earth_objects[date].length;
          asteroidCount.push(count);

          data.near_earth_objects[date].map((val) => {
            console.log("total----->", val);
            //closest astroid
            const distance = val;
            closestAsteroid.push(distance);
            closestAsteroid.sort(
              (a, b) =>
                a.close_approach_data[0].miss_distance.kilometers -
                b.close_approach_data[0].miss_distance.kilometers
            );
            console.log(closestAsteroid);
            //average size of asteroids
            const size =
              val.estimated_diameter.kilometers.estimated_diameter_max;
            console.log(size);
            avgSizeOfAsteroid.push(size);

            //sort according to km/hr
            fastestAsteroid.push(val.close_approach_data[0]);
            fastestAsteroid.sort(
              (a, b) =>
                b.relative_velocity.kilometers_per_hour -
                a.relative_velocity.kilometers_per_hour
            );
          });

          const avgsize = avgSizeOfAsteroid.reduce(
            (acc, current) => acc + current,
            0
          );
          console.log((avgsize / avgSizeOfAsteroid.length).toFixed(2));
          setData({
            closest: closestAsteroid[0],
            fastest: fastestAsteroid[0],
            average: avgsize / closestAsteroid.length,
          });
        });

        console.log(fastestAsteroid);
        console.log(asteroidCount);
        setChart({
          labels: dates,
          datasets: [
            {
              label: "Number of asteroids",
              data: asteroidCount,
              fill: true,
              borderColor: "red",
              backgroundColor:[ "red","green","blue","black","yellow","white","orange","violet"]
            },
          ],
        });
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  
  console.log("final", data);
  const options = {
    responsive: true,
    scales: {
    
    r:{
      suggestedMin:0,
      suggestedMax:20,
      grid:{
circular:true,
color:"white"
      },
    // angleLines:{
    //   display:true,
    //   color:"red",
    //   lineWidth:2
    // }

    }
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgb(255, 99, 132)",
          width: "100",
        },
      },
      title: {
        display: true,
        text: "Number of Asteroid near Earth",
        color: "white",
      },
      label: {
        color: "white",
      },
      
    },
    maintainAspectRatio: true, // Disable the aspect ratio
    height: 800, // Set the height of the chart
    width: 800,
    chart: {
      backgroundColor: "black",
    },
  };

  const start = (date) => {
    const start_date = moment(new Date(date.target.value)).format("YYYY-MM-DD");
    setStartDate(start_date);
    setDates({...dates,startdate:start_date})
    console.log(dates);
  };
  const end = (date) => {
    const end_date = moment(new Date(date.target.value)).format("YYYY-MM-DD");
    setEndDate(end_date)
    setDates({...dates,enddate:end_date})
    console.log(dates);
  };

  return (
    <div className="container">
      {show?<div className="modal">
      <div className=" top_modal">
      <h1>Date Selecting Criteria</h1>
      <h1 style={{color:"red",cursor:"pointer"}} onClick={()=>setShow(false)}>X</h1>
      </div>
      <hr></hr>
      <div className="constraints">
     <ul>
      <li>Start date and end date should be different</li>
      <li>Start date and end date difference should be less than 7 days</li>
      <li>Start date should be less than end date</li>
      <li>End date should not be greater than today</li>
      
     </ul>
      </div>
      <hr/>
      <div><button className="close" onClick={()=>setShow(false)}>Close</button></div>
      </div>:""}
      <div className="main">
       
      <ToastContainer />

      <div className="input">
        <div className="datepicker">
          <h3>Select Start Date</h3>
          <input type="date" onChange={start} />
        </div>
        <div className="datepicker">
          <h3>Select End Date</h3>
          <input type="date" onChange={end} />
        </div>
        
        <div  className="btn_section">
          <div className="fetch">
          <button className="submit" onClick={fetchData} disabled={loading}>
            {loading ? "Fetching..." : "Submit"}
          </button>
          {loading ? (
            <div className="loading">
              <img style={{padding:"1rem"}}
                src={rocket}
                width={100}
                height={100}
                allowFullScreen
                className={loading ? "none" : "launch"}
              ></img>
            </div>
          ) : (
            <div></div>
          )}
          </div>
          <div ><button onClick={()=>setShow(true)}>instruction</button></div>
        </div>
     
      </div>
      <div className="chart">
        {Object.keys(chart).length > 0 && (
          <div>
       

          <PolarArea options={options} data={chart}  className="polar" />
          </div>
        )}

      </div>
      {(data.closest!==""&&data.average!==""&&data.fastest!=="")&&
      <div className="starts">
        <div className="closest">
          <h1>Closest Asteroid</h1>
          The distance of the asteroid at the closest time was
          <b>{parseFloat(data.closest.close_approach_data[0].miss_distance.kilometers).toFixed(2)} kms</b> on
          date <b>{data.closest.close_approach_data[0].close_approach_date_full.split(" ")[0]  } at {data.closest.close_approach_data[0].close_approach_date_full.split(" ")[1]}</b>
        </div>
        <div className="fastest">
          <h1>Fastest Asteroid</h1>
           Speed of fasted Asteroid was 
            <b>{parseFloat(data.fastest.relative_velocity.kilometers_per_hour).toFixed(2)} KM/H</b>  found on <b>{data.fastest.close_approach_date_full.split(" ")[0]} </b> at <b>{data.fastest.close_approach_date_full.split(" ")[1]}</b>
        </div>

        <div className="average">
          <h1>Average Size of Asteroid</h1>
           Average Size of Asteroid during period <b>{startdate} to {enddate} </b> was <b>{parseFloat(data.average).toFixed(2)} KM</b>
          
        </div>
      </div>
      }
      </div>
    </div>
  );
};

export default DateInput;

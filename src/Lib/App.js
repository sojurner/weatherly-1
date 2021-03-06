import React, { Component } from "../../../../../../Library/Caches/typescript/2.9/node_modules/@types/react";
import "./CSS/App.css";
import Welcome from "./Welcome";
import WelcomeRendered from "./WelcomeRendered";
import Search from "./Search";
import Key from "./Key";
import { SevenHourTab } from "./SevenHourTab";
import { CurrentWeather } from "../CurrentWeather";
import { TenDayTab } from "./TenDayTab";
import { SevenHourForecast } from "./SevenHourForecast";
import { TenDayForecast } from "./TenDayForecast";
import { currWeather, sevenHour, tenDay } from "./DataScrape";

class App extends Component {
  constructor() {
    super();
    this.state = {
      userLocation: "",
      currentWeather: {},
      sevenHourForecast: [],
      tenDayForecast: [],
      currentWeatherClicked: true,
      sevenHourClicked: false,
      tenDayClicked: false,
      searched: false,
      error: false
    };
  }

  componentDidMount = () => {
    if (localStorage.getItem("Location")) {
      this.getWeather(localStorage.getItem("Location"));
    }
  };

  getWeather = search => {
    const url = `http://api.wunderground.com/api/${Key}/geolookup/conditions/hourly/forecast10day/q/${search}.json`;
    fetch(url)
      .then(data => {
        return data.json();
      })
      .then(response => {
        this.setState({
          userLocation: "",
          currentTime: currWeather(response).time,
          currentWeather: currWeather(response),
          sevenHourForecast: sevenHour(response),
          tenDayForecast: tenDay(response),
          searched: true,
          error: false
        });
      })
      .catch(error => {});
    localStorage.setItem("Location", search);
  };

  setLocation = search => {
    this.setState({ userLocation: search });
    this.getWeather(search);
  };

  changeWeatherClicked = (current, seven, ten) => {
    this.setState({
      currentWeatherClicked: current,
      sevenHourClicked: seven,
      tenDayClicked: ten
    });
  };

  render() {
    if (this.state.searched === false) {
      return (
        <div className="input-container rendered-container">
          <Welcome />
          <Search
            userLocation={this.state.userLocation}
            setLocation={this.setLocation}
          />
        </div>
      );
    }
    return (
      <div className="input-container">
        <WelcomeRendered />
        <Search
          searched={this.state.searched}
          userLocation={this.state.userLocation}
          setLocation={this.setLocation}
        />
        {this.state.searched && (
          <CurrentWeather currentWeather={this.state.currentWeather} />
        )}
        <SevenHourTab changeWeatherClicked={this.changeWeatherClicked} />
        <TenDayTab changeWeatherClicked={this.changeWeatherClicked} />
        {this.state.sevenHourClicked && (
          <SevenHourForecast sevenHourForecast={this.state.sevenHourForecast} />
        )}
        {this.state.tenDayClicked && (
          <TenDayForecast tenDayForecast={this.state.tenDayForecast} />
        )}
      </div>
    );
  }
}

export default App;

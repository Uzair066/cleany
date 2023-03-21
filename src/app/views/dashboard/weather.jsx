import React from 'react';
import ReactWeather, { useWeatherBit } from 'react-open-weather';

function WeatherComponent({ formData }) {
  const { data, isLoading, errorMessage } = useWeatherBit({
    // key: 'ac69bc70043f4c47aec73dfd3a19007e',
    key: '56beb861c641478b802fa7e0cc05260f',
    lat: formData[0]?.latitude,
    lon: formData[0]?.longitude,
    lang: 'en',
    unit: 'metric',
  });

  return (
    <ReactWeather
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel={formData[0]?.city}
      unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
      showForecast
    />
  );
}

export default WeatherComponent;

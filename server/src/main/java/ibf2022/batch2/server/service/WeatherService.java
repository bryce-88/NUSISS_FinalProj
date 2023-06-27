package ibf2022.batch2.server.service;

import java.io.StringReader;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import ibf2022.batch2.server.model.Weather;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

@Service
public class WeatherService {

    private final static Logger log = LoggerFactory.getLogger(WeatherService.class);
    public final static String URL = "https://api.openweathermap.org/data/2.5/weather";

    @Value("${WEATHERMAP_KEY}")
    private String apiKey;
    

    public Optional<Weather> getWeather(String city) {

        String url = UriComponentsBuilder.fromUriString(URL)
                        .queryParam("q", city)
                        .queryParam("units", "metric")
                        .queryParam("appid", apiKey)
                        .toUriString();

        RequestEntity<Void> req = RequestEntity.get(url).accept(MediaType.APPLICATION_JSON).build();

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> resp = null;

        String payload;
        // int statusCode;

        try {
            resp = restTemplate.exchange(req, String.class);
            payload = resp.getBody();
            // statusCode = resp.getStatusCode().value();
        } catch (HttpClientErrorException ex) {
            log.error(ex.getResponseBodyAsString());
            return Optional.empty();
        }

        Weather weatherResp = new Weather();
        weatherResp.setCity(city);

        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject weatherJson = reader.readObject();
        JsonObject jo = weatherJson.getJsonObject("main");
        

        weatherResp.setTemp((float)jo.getJsonNumber("temp").doubleValue());
        weatherResp.setFeelsLike((float)jo.getJsonNumber("feels_like").doubleValue());
        weatherResp.setTempMax((float)jo.getJsonNumber("temp_max").doubleValue());
        weatherResp.setTempMin((float)jo.getJsonNumber("temp_min").doubleValue());
        weatherResp.setHumidity((float)jo.getJsonNumber("humidity").doubleValue());
        JsonArray weatherArr = weatherJson.getJsonArray("weather");

        weatherResp.setIcon(weatherArr.getJsonObject(0).getString("icon"));

        String main = weatherArr.getJsonObject(0).getString("main");
        String desc = weatherArr.getJsonObject(0).getString("description");
        weatherResp.setDescription(main + " - " + desc );

        // log.info(">>WeatherService weatherResp : " + weatherResp.toString());

        return Optional.of(weatherResp);
    }
}


package ibf2022.batch2.server.controller;

import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ibf2022.batch2.server.model.Weather;
import ibf2022.batch2.server.service.WeatherService;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;

@RestController
//need this for development, but not for production
// @RequestMapping(path="/api")
@RequestMapping
@CrossOrigin(origins="*")
public class WeatherController {
    
    // private final static Logger log = LoggerFactory.getLogger(WeatherController.class);

    @Autowired
    WeatherService weatherSvc;

    @GetMapping(path="/weather")
    public ResponseEntity<?> getWeather(@RequestParam String city) {
        Optional<Weather> optWeather = weatherSvc.getWeather(city);
        JsonObjectBuilder jObjBuilder = Json.createObjectBuilder();
        
        if (optWeather.isPresent()) {
            Weather weather = optWeather.get();
            JsonObject weatherResp = jObjBuilder.add("description", weather.getDescription())
                                        .add("temp", weather.getTemp())
                                        .add("tempMin", weather.getTempMin())
                                        .add("tempMax", weather.getTempMax())
                                        .add("feelsLike", weather.getFeelsLike())
                                        .add("humidity", weather.getHumidity())
                                        .add("icon", weather.getIcon())                                                                                                                                                                                                        
                                        .build();
            return ResponseEntity.ok(weatherResp.toString());
        } else {
            return null;
        }
    }
}

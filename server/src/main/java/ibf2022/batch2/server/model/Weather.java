package ibf2022.batch2.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Weather {

    private String city;
    private String description;
    private float temp;
    private float tempMin;
    private float tempMax;
    private float feelsLike;
    private float humidity;
    private String icon;
    
}

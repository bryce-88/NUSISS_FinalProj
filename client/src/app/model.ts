export interface User {
    login: string; //email
    password: string;
}

export interface Itineraries {
    login: string;
    title: string;
}

export interface ItineraryDetails {

        count: number;
        login: string;
        title: string;
        activitydate: Date;
        time: string;
        location: string;
        activity: string;
        comments: string;
        file: string;

}

export interface EmailDetails {

    recipient: string;
    msgBody: string;
    subject: string;
    attachment: string;
     
}

export interface PlaceSearchResult {
    address: string;
    location?: google.maps.LatLng;
    name?: string;
}

export class Weather {
    constructor(
        public city: string,
        public description: string,
        public temp: number,
        public tempMin: number,
        public tempMax: number,
        public feelsLike: number,
        public humidity: number,
        public icon: string
    ) {}
}

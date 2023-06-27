// package ibf2022.batch2.server;

// import java.text.SimpleDateFormat;
// import java.util.List;

// import ibf2022.batch2.server.model.ItineraryDetails;
// import jakarta.json.Json;
// import jakarta.json.JsonArrayBuilder;
// import jakarta.json.JsonObject;
// import jakarta.json.JsonObjectBuilder;

// public class Utils {
    
//     //TODO: attachments field to be added
//     public static JsonObject toJson(List<ItineraryDetails> listItineraries) {
//         JsonArrayBuilder jArrBuilder = Json.createArrayBuilder();
//         JsonObjectBuilder jObjBuilder = Json.createObjectBuilder();
//         SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//         for (ItineraryDetails i : listItineraries) {
//             jObjBuilder.add("login", i.getLogin())
//                                             .add("title", i.getTitle())
//                                             .add("activitydate", dateFormat.format(i.getActivitydate()))
//                                             .add("activity", i.getActivity());
//             //to handle fields that are null
//             if (i.getLocation() != null) {
//                 jObjBuilder.add("location", i.getLocation());
//             } else {
//                 jObjBuilder.addNull("location");
//             }
//             if (i.getTime() != null) {
//                 jObjBuilder.add("time", i.getTime());
//             } else {
//                 jObjBuilder.addNull("time");
//             }
//             if (i.getComments() != null) {
//                 jObjBuilder.add("comments", i.getComments());
//             } else {
//                 jObjBuilder.addNull("comments");
//             }

//             JsonObject jItinerary = jObjBuilder.build();
                                            
//             jArrBuilder.add(jItinerary);
//         }
//         JsonObject itineraries = jObjBuilder.add("Itineraries", jArrBuilder).build();

//         return itineraries;
//     }
// }

package ibf2022.batch2.server.controller;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import ibf2022.batch2.server.model.ItineraryDetails;
import ibf2022.batch2.server.model.UserDetails;
import ibf2022.batch2.server.repository.ItineraryRepository;
import ibf2022.batch2.server.service.EmailService;
import ibf2022.batch2.server.service.UserService;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;

@Controller
//need this for development, but not for production
// @RequestMapping(path="/api")
@RequestMapping
@CrossOrigin(origins="*")
public class ItineraryController {

    private static final Logger log = LoggerFactory.getLogger(ItineraryController.class);
    private static final String BASE64_PREFIX = "data:application/pdf;base64,";

    @Autowired
    ItineraryRepository itineraryRepo;

    @Autowired
    UserService userSvc;

    @Autowired
    EmailService mailSvc;

    @GetMapping(path="/getitinerary")
    public ResponseEntity<?> getUserItinerary(@RequestParam String login) {
        List<ItineraryDetails> listItineraries = itineraryRepo.getItinerary(login);
        // log.info("\n\n>>> List of Itineraries: " + listItineraries.toString());

        return ResponseEntity.ok(listItineraries);
    }

    @DeleteMapping(path="/delete/{login}/{title}")
    public ResponseEntity<?> deleteItinerary(@PathVariable String login, @PathVariable String title) {
        int iDeleted = itineraryRepo.deleteItinerary(login, title);
        JsonObjectBuilder jBuilder = Json.createObjectBuilder();
        if (iDeleted == 1) {
            log.info("Deleted");
            JsonObject status = jBuilder.add("Status", "Record deleted").build();
            return ResponseEntity.ok(status.toString());
        } else {
            JsonObject status = jBuilder.add("Status", "Unable to delete record").build();
            return ResponseEntity.internalServerError().body(status.toString());
        }
        
    }

    @PostMapping(path="/post/{login}/{title}", consumes=MediaType.APPLICATION_FORM_URLENCODED_VALUE ,produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postItinerary(@PathVariable String login, @PathVariable String title) {
        int iCreated = itineraryRepo.postItinerary(login, title);
        if (iCreated == 1) {
            log.info("Created");
            // JsonObject status = jBuilder.add("Status", 1).build();
            return ResponseEntity.ok(1);
        } else {
            // JsonObject status = jBuilder.add("Status", 0).build();
            return ResponseEntity.internalServerError().body(0);
        }
    }



    @PostMapping(path="/post/activity", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<?> postItineraryDetails(@RequestPart(required=true) String login,
                                                    @RequestPart(required=true) String title,
                                                    @RequestPart(required=true) String activitydate,
                                                    @RequestPart(required=true) String time,
                                                    @RequestPart(required=false) String location,
                                                    @RequestPart(required=true) String activity,
                                                    @RequestPart(required=false) String comments,
                                                    @RequestPart(required=false) MultipartFile file) throws IOException {
        log.info("PostMapping of Details called");

        int iPostDetails = 0;
        try {
            iPostDetails = itineraryRepo.postItineraryDetails(login, title, activitydate, time, location, activity, comments, file);
            if (iPostDetails != 0) {

                return ResponseEntity.ok(iPostDetails);
            } else {
                iPostDetails = 0;
                return ResponseEntity.internalServerError().body(iPostDetails);
            }
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body(iPostDetails);
        }
    }

    @GetMapping(path="/add")
    public ResponseEntity<?> getItineraryDetails(@RequestParam String login, @RequestParam String title) {
        List<ItineraryDetails> itineraryDetails = itineraryRepo.getItineraryDetails(login, title).get();
        return ResponseEntity.ok(itineraryDetails);
    }


    @DeleteMapping(path="/delete/{count}")
    public ResponseEntity<?> deleteSingleItineraryDetail(@PathVariable int count) {
        log.info(">>Delete controller called");
        int iDeleted = itineraryRepo.deleteSingleItineraryDetail(count);
        JsonObjectBuilder jBuilder = Json.createObjectBuilder();
        if (iDeleted == 1) {
            log.info("Deleted");
            JsonObject status = jBuilder.add("Status", "Record deleted").build();
            // return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(status.toString());
            return ResponseEntity.ok(status.toString());
        } else {
            JsonObject status = jBuilder.add("Status", "Unable to delete record").build();
            // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.APPLICATION_JSON).body(status.toString());
            return ResponseEntity.internalServerError().body(status.toString());
        }
    }


    @GetMapping(path="/getedit/{count}")
    public ResponseEntity<?> getItineraryToEdit(@PathVariable int count) {
        Optional<ItineraryDetails> optDetail = this.itineraryRepo.getItineraryToEdit(count);
        ItineraryDetails detail = optDetail.get();
        log.info(">>> Attachment: " + detail.getAttachment());
        String encodedString = "";
        if (detail.getAttachment() != null) {
            encodedString = Base64.getEncoder().encodeToString(detail.getAttachment());
            JsonObject payload = Json.createObjectBuilder()
                        .add("login", detail.getLogin())
                        .add("title", detail.getTitle())
                        .add("activitydate", detail.getActivitydate().toString())
                        .add("time", detail.getTime() != null ? detail.getTime() : "")
                        .add("location", detail.getLocation() != null ? detail.getLocation() : "")
                        .add("activity", detail.getActivity())
                        .add("comments", detail.getComments() != null ? detail.getComments() : "")
                        .add("file", BASE64_PREFIX + encodedString)
                        .build();
            return ResponseEntity.ok(payload.toString());
        } else if (detail.getAttachment() == null) {
            JsonObject payload = Json.createObjectBuilder()
                                    .add("login", detail.getLogin())
                                    .add("title", detail.getTitle())
                                    .add("activitydate", detail.getActivitydate().toString())
                                    .add("time", detail.getTime() != null ? detail.getTime() : "")
                                    .add("location", detail.getLocation() != null ? detail.getLocation() : "")
                                    .add("activity", detail.getActivity())
                                    .add("comments", detail.getComments() != null ? detail.getComments() : "")
                                    .add("file", "")
                                    .build();
            return ResponseEntity.ok(payload.toString());
        } else {
            return null;
        }
    }

    @PutMapping(path="/update/{count}")
    public ResponseEntity<?> updateItineraryActivity(@PathVariable int count,
                                                    @RequestPart(required=true) String login,
                                                    @RequestPart(required=true) String title,
                                                    @RequestPart(required=true) String activitydate,
                                                    @RequestPart(required=true) String time,
                                                    @RequestPart(required=false) String location,
                                                    @RequestPart(required=true) String activity,
                                                    @RequestPart(required=false) String comments,
                                                    @RequestPart(required=false) MultipartFile file) {

        int iUpdated = 0;
        log.info(">> PutMapping called");
        log.info(">>>count" + count);
        try {
            iUpdated = itineraryRepo.updateItinerary(login, title, activitydate, time, location, activity, comments, file, count);
            if (iUpdated != 0) {
                return ResponseEntity.ok(iUpdated);
            } else {
                iUpdated = 0;
                return ResponseEntity.internalServerError().body(iUpdated);
            }
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(iUpdated);
        }
    }

    @GetMapping(path="/getdisplay")
    public ResponseEntity<?> getItineraryToDisplay(@RequestParam String login, @RequestParam String title) {
        Optional<List<ItineraryDetails>> optDetail = this.itineraryRepo.getItineraryToDisplay(login, title);

        JsonArrayBuilder jArrB = Json.createArrayBuilder();
        
        if (optDetail.isPresent()) {
            List<ItineraryDetails> detailsList = optDetail.get();
            String encodedString = "";
            for (ItineraryDetails i : detailsList) {
                if (i.getAttachment() != null) {
                    encodedString = Base64.getEncoder().encodeToString(i.getAttachment());
                    JsonObject detail = Json.createObjectBuilder()
                                .add("count", i.getCount())
                                .add("login", i.getLogin())
                                .add("title", i.getTitle())
                                .add("activitydate", i.getActivitydate().toString())
                                .add("time", i.getTime() != null ? i.getTime() : "")
                                .add("location", i.getLocation() != null ? i.getLocation() : "")
                                .add("activity", i.getActivity())
                                .add("comments", i.getComments() != null ? i.getComments() : "")
                                .add("file", BASE64_PREFIX + encodedString)
                                .build();
                    jArrB.add(detail);
                } else if (i.getAttachment() == null) {
                    JsonObject detail = Json.createObjectBuilder()
                                        .add("count", i.getCount())
                                        .add("login", i.getLogin())
                                        .add("title", i.getTitle())
                                        .add("activitydate", i.getActivitydate().toString())
                                        .add("time", i.getTime() != null ? i.getTime() : "")
                                        .add("location", i.getLocation() != null ? i.getLocation() : "")
                                        .add("activity", i.getActivity())
                                        .add("comments", i.getComments() != null ? i.getComments() : "")
                                        .add("file", "")
                                        .build();
                    jArrB.add(detail);
                }
            }
            
            JsonObjectBuilder jObjB = Json.createObjectBuilder();
            JsonObject payload = jObjB.add("activities", jArrB).build();
            log.info(">> JSON payload: " + payload.toString());
            return ResponseEntity.ok(payload.toString());
        } else {
            JsonObjectBuilder jObjB = Json.createObjectBuilder();
            JsonObject payload = jObjB.add("activites", "").build();
            return ResponseEntity.ok(payload.toString());
        }
    }


    @PostMapping(path="/senditinerary")
    public ResponseEntity<?> sendMailWithItinerary(@RequestPart String recipient,
                                                    @RequestPart String msgBody,
                                                    @RequestPart String subject,
                                                    @RequestPart(required=true) MultipartFile attachment) throws IOException {
        String mailStatus = mailSvc.sendMailWithAttachment(recipient, msgBody, subject, attachment);
        if (mailStatus.equals("Mail sent")) {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObject resp = builder.add("Status", "Success").build();
            return ResponseEntity.ok(resp.toString());
        } else {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObject resp = builder.add("Status", "Failed").build();
            return ResponseEntity.internalServerError().body(resp.toString());
        }
    }

    //if Optional is not empty from UserService, means login exists
    //so just need to check password here
    @PostMapping(path="/user")
    public ResponseEntity<?> login(@RequestPart String login,
                                    @RequestPart String password) {

        int loginStatus = userSvc.userLogin(login, password);
        if (loginStatus == 1) {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObject resp = builder.add("Status", "Success").build();
            log.info(">>> Login response: " + resp.toString());
            return ResponseEntity.ok(resp.toString());
        } else {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObject resp = builder.add("Status", "Invalid").build();
            log.info(">>> Login response (if-if-else): " + resp.toString());
            return ResponseEntity.internalServerError().body(resp.toString());
        }        
    }

    @PostMapping(path="/create")
    public ResponseEntity<?> create(@RequestPart String login,
                                    @RequestPart String password) {

        boolean loginExist = true;
        Optional<UserDetails> optUser = userSvc.checkLoginExist(login);
        if (!optUser.isPresent()) {
            loginExist = false;
        }
        if (loginExist == true) {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObject resp = builder.add("Status", "Invalid").build();
            return ResponseEntity.ok(resp.toString());
        } 
                       
        //if loginExist == false, this block will execute
        int createStatus = 0;
        createStatus = userSvc.createUser(login, password);
        if (createStatus == 0) {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObject resp = builder.add("Status", "Failed").build();
            return ResponseEntity.ok(resp.toString());
        } else {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObject resp = builder.add("Status", "Created").build();
            return ResponseEntity.ok(resp.toString());
        }
                                    
    }

}
package ibf2022.batch2.server.repository;

import java.io.IOException;
import java.io.Serializable;
import java.sql.Blob;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import ibf2022.batch2.server.model.Itineraries;
import ibf2022.batch2.server.model.ItineraryDetails;

@Repository
public class ItineraryRepository implements Serializable {
    
    @Autowired
    JdbcTemplate jdbcTemplate;

    private static final Logger log = LoggerFactory.getLogger(ItineraryRepository.class);

    private final String getItinerarySQL = "select * from itineraries where login = ?";
    private final String deleteItinerarySQL = "delete from itineraries where login = ? and title = ?";
    private final String deleteItineraryDetailsSQL = "delete from itinerary_details where login = ? and title = ?";
    private final String checkUniqueTitleSQL = "select title from itineraries where login = ? and title = ?";
    private final String postItinerarySQL = "insert into itineraries (login, title) values (?, ?)";
    private final String postItineraryDetailsSQL = "insert into itinerary_details (login, title, activitydate, time, location, activity, comments, attachment) values (?, ?, ?, ?, ?, ?, ?, ?)";
    private final String getItineraryDetailsSQL = "select * from itinerary_details where login=? and title=? order by activitydate, time";
    private final String deleteSingleItineraryDetailSQL = "delete from itinerary_details where count = ?";
    private final String getItineraryToEditSQL = "select * from itinerary_details where count=?";
    private final String updateItinerarySQL = "update itinerary_details set login=?, title=?, activitydate=?, time=?, location=?, activity=?, comments=?, attachment=? where count=?";

    //if no elements in List, it will return an empty array
    public List<ItineraryDetails> getItinerary(String login) {
        List<ItineraryDetails> itineraries = jdbcTemplate.query(getItinerarySQL, BeanPropertyRowMapper.newInstance(ItineraryDetails.class), login);
        log.info(">>> List of Itineraries per Login ID: " + itineraries.toString());
        return itineraries;
    }

    public int deleteItinerary(String login, String title) {

        int iDeleteFromItineraries = 0;
        int iDeleteFromItineraryDetails = 0;

        PreparedStatementSetter pss = new PreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, login);
                ps.setString(2, title);
            }
        };

        iDeleteFromItineraries = jdbcTemplate.update(deleteItinerarySQL, pss);
        iDeleteFromItineraryDetails = jdbcTemplate.update(deleteItineraryDetailsSQL,pss);

        if (iDeleteFromItineraries > 0 || iDeleteFromItineraryDetails > 0) {
            return 1;
        }

        return 0;
    }

    
    public int postItinerary(String login, String title) {
        boolean titleExist = false;
        int titleCreated = 0;
        List<Itineraries> userItineraries = jdbcTemplate.query(checkUniqueTitleSQL, BeanPropertyRowMapper.newInstance(Itineraries.class), login, title);
        for (Itineraries i : userItineraries) {
            if (i.getTitle().equalsIgnoreCase(title)) {
                titleExist = true;
                titleCreated = 0;
            }
        }

        //if new title entered by user does not exist, go ahead and create record in Itineraries table SQL
        if (titleExist == false) {

            PreparedStatementSetter pss = new PreparedStatementSetter() {

                @Override
                public void setValues(PreparedStatement ps) throws SQLException {
                    ps.setString(1, login);
                    ps.setString(2, title);
                }
            };

            titleCreated = jdbcTemplate.update(postItinerarySQL, pss);
        }

        return titleCreated;
    }

    public int postItineraryDetails(String login, String title, String activitydate, 
                String time, String location, String activity, String comments, MultipartFile attachment) throws IOException {

        int activityCreated = 0;

        PreparedStatementSetter pss = new PreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, login);
                ps.setString(2, title);
                ps.setString(3, activitydate);
                ps.setString(4, time);
                ps.setString(5, location);
                ps.setString(6, activity);
                ps.setString(7, comments);
                try {
                    // InputStream attachmentStream = attachment.getInputStream();
                    byte[] attachmentData = attachment.getBytes();
                    Blob attachmentBlob = new javax.sql.rowset.serial.SerialBlob(attachmentData);
                    ps.setBlob(8, attachmentBlob);
                    log.info(">>Blob");
                } catch (NullPointerException ex) {
                    ps.setNull(8, Types.BLOB);
                    log.info(">>No blob");
                } catch (IOException ex) {
                    ex.printStackTrace();
                    log.info(">>> IOException on postItineraryDetails ");
                }
            }
        };

        activityCreated = jdbcTemplate.update(postItineraryDetailsSQL, pss);

        //if 1 is returned, activity successfully created
        //if 0 is returned, activity not created due to errors
        return activityCreated;
    }

    public Optional<List<ItineraryDetails>> getItineraryDetails(String login, String title) {
        try {
            Optional<List<ItineraryDetails>> itineraryDetails = Optional.of(jdbcTemplate.query(getItineraryDetailsSQL, BeanPropertyRowMapper.newInstance(ItineraryDetails.class), login, title));
            // log.info(">>> Existing Itinerary Details " + itineraryDetails.toString());
            return itineraryDetails;
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    public int deleteSingleItineraryDetail(int count) {

        int iDeleted = 0;

        PreparedStatementSetter pss = new PreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setInt(1, count);
            }
        };

        iDeleted = jdbcTemplate.update(deleteSingleItineraryDetailSQL, pss);

        if (iDeleted > 0) {
            return 1;
        }

        return 0;
    }

    //     public Optional<ItineraryDetails> getItineraryToEdit(int count) {
    //     try {
    //         Optional<ItineraryDetails> itineraryDetails = Optional.of(jdbcTemplate.queryForObject(getItineraryToEditSQL, BeanPropertyRowMapper.newInstance(ItineraryDetails.class), count));
    //         // log.info(">>> Existing Itinerary Details " + itineraryDetails.toString());
    //         return itineraryDetails;
    //     } catch (Exception ex) {
    //         return Optional.empty();
    //     }
    // }

    public Optional<ItineraryDetails> getItineraryToEdit(int count) {
        return jdbcTemplate.query(
            getItineraryToEditSQL,
            (ResultSet rs)->{
                if(!rs.next())
                    return Optional.empty();
                final ItineraryDetails detail = ItineraryDetails.populate(rs);
                return Optional.of(detail);
            }
        , count);
    }

    public int updateItinerary(String login, String title, String activitydate, 
                String time, String location, String activity, String comments, MultipartFile attachment, int count) {

        int iUpdated = 0;

        //login=?, title=?, activitydate=?, time=?, location=?, activity=?, comments=?, attachment=? where count=?
        PreparedStatementSetter pss = new PreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, login);
                ps.setString(2, title);
                ps.setString(3, activitydate);
                ps.setString(4, time);
                ps.setString(5, location);
                ps.setString(6, activity);
                ps.setString(7, comments);
                try {
                    byte[] attachmentData = attachment.getBytes();
                    Blob attachmentBlob = new javax.sql.rowset.serial.SerialBlob(attachmentData);
                    ps.setBlob(8, attachmentBlob);
                    log.info(">>Blob");
                } catch (NullPointerException ex) {
                    ps.setNull(8, Types.BLOB);
                    log.info(">>No blob");
                } catch (IOException ex) {
                    ex.printStackTrace();
                    log.info(">>> IOException on postItineraryDetails ");
                }
                ps.setInt(9, count);
            }
        };
        log.info("Before update");
        iUpdated = jdbcTemplate.update(updateItinerarySQL, pss);
        log.info("iUpdated count: " + iUpdated);

        return iUpdated;
    }

    public Optional<List<ItineraryDetails>> getItineraryToDisplay(String login, String title) {
        List<ItineraryDetails> detailsList = new LinkedList<>();
        return jdbcTemplate.query(
            getItineraryDetailsSQL,
            (ResultSet rs)->{
                while (rs.next()) {
                    final ItineraryDetails detail = ItineraryDetails.populate(rs);
                    detailsList.add(detail);
                }
            return detailsList.isEmpty() ? Optional.empty() : Optional.of(detailsList);
        },
        login, title);
    }

}

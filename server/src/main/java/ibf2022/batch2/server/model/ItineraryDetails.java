package ibf2022.batch2.server.model;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryDetails {
    private int count;
    private String login;
    private String title;
    private Date activitydate;
    private String time;
    private String location;
    private String activity;
    private String comments;
    private byte[] attachment;

    public static ItineraryDetails populate(ResultSet rs) throws SQLException{
        final ItineraryDetails detail = new ItineraryDetails();
        detail.setCount(rs.getInt("count"));
        detail.setLogin(rs.getString("login"));
        detail.setTitle(rs.getString("title"));
        detail.setActivitydate(rs.getDate("activitydate"));
        detail.setTime(rs.getString("time"));
        detail.setLocation(rs.getString("location"));
        detail.setActivity(rs.getString("activity"));
        detail.setComments(rs.getString("comments"));
        detail.setAttachment(rs.getBytes("attachment"));
        return detail;
    }
}


package ibf2022.batch2.server.service;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Service;

import ibf2022.batch2.server.model.UserDetails;


@Service
public class UserService {
    
    @Autowired
    JdbcTemplate jdbcTemplate;

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final String checkLoginSQL = "update user_details set login=?, password=? where login=? and password=?";
    private final String checkLoginExistSQL = "select * from user_details where login = ?";
    private final String createUserSQL = "insert into user_details (login, password) values (?, ?)";


    public int userLogin(String login, String password) {

        //if 0 means 'where' criteria does not exist in SQL, so no match and not updated, returns 0
        int loginStatus = 0;

        PreparedStatementSetter pss = new PreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, login);
                ps.setString(2, password);
                ps.setString(3, login);
                ps.setString(4, password);
            }
            
        };

        loginStatus = jdbcTemplate.update(checkLoginSQL, pss);
        log.info(">>> UserService loginStatus: " + loginStatus);

        return loginStatus;
    }

    public Optional<UserDetails> checkLoginExist(String login) {
        try {
            Optional<UserDetails> optUser = Optional.of(jdbcTemplate.queryForObject(checkLoginExistSQL, BeanPropertyRowMapper.newInstance(UserDetails.class), login));
            return optUser;
        } catch (EmptyResultDataAccessException ex) {
            return Optional.empty();
        }
    }

    public int createUser(String login, String password) {

        int createStatus = 0;

        PreparedStatementSetter pss = new PreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setString(1, login);
                ps.setString(2, password);
            }
        };

        createStatus = jdbcTemplate.update(createUserSQL, pss);

        return createStatus;
    }

    


}

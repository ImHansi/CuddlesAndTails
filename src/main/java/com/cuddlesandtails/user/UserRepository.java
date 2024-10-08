package com.cuddlesandtails.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

//import lk.bitproject.user.User;



public interface UserRepository extends JpaRepository<User,Integer>{

    //SELECT * FROM bitproject.employee as e where e.id not in (select u.employee_id from bitproject.user as u where u.employee_id is not null);
    
    //create query for get user by given email
    @Query(value="select u from User u where u.email=?1")
    public User getUserByEmail(String email);


    //create query for get user by given username
    @Query(value="select u from User u where u.username=?1")
    public User getUserByUsername(String username);

    //employee_id.id -from-> employee_id object
    @Query(value="select u from User u where u.employee_id.id=?1")
    public User getUserByEmployee(Integer empId);

    //query to get username by id because its  a full object
    @Query(value="select new User(u.id, u.username) from User u where u.id=?1")
    //since its an full object passing from user we cant take the username without a constructor
    public User getUserNameById(int userid);
}

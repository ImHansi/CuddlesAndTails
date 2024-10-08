package com.cuddlesandtails.employee;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;




public interface EmployeeDao extends JpaRepository<Employee , Integer>{


    @Query(value = "SELECT lpad(max(e.empno)+1,4,0) as empno FROM cuddlesandtails.employee as e;", nativeQuery = true)
    public String getNextEmpNumber();


    @Query(value = "select e from Employee e where e.nic=?1")
    public Employee getEmployeeByNic(String nic);


    @Query(value = "select e from Employee e where e.email=:email")
    public Employee getEmployeeByEmail(@Param("email") String email);


    //define query for get employee without having user account
    @Query(value = "select e from Employee e where e.id not in(select u.employee_id from User u)")
    public List<Employee> getListBywithoutUserAccount();

    //to write query 
    //1. native query, 2. JPQL(HQL) query

    //create query to get breed by given pettype id 
    @Query("select e from Employee e where e.employeestatus_id.id=?1")
    List<Employee> getByEmployeestatus(Integer employeesatusid);
    
    
}

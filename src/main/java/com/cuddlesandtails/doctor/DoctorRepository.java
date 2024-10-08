package com.cuddlesandtails.doctor;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;




public interface DoctorRepository extends JpaRepository<Doctor,Integer>{
    

    //to write query 
    //1. native query, 2. JPQL(HQL) query

    @Query(value ="SELECT lpad(max(d.docno)+1,4,0) as docno FROM cuddlesandtails.doctor as d;" ,nativeQuery = true)
    //SELECT concat('D', lpad(substring(max(d.docno), 5)+1 ,4 ,0)) as docno FROM cuddlesandtails.doctor as d;
    public String getDoctorNumber();

    @Query(value="select d from Doctor d where d.nic=?1")
    public Doctor getByNic(String nic);

    @Query(value="select d from Doctor d where d.email=?1")
    public Doctor getByEmail(@Param("email")String email);

    //define query for get doctor without having user account
    //@Query(value = "select d from Doctor d where d.id not in(select u.doctor_id from User u)")
    @Query(value = "select d from Doctor d where d.id not in(select u.doctor_id from User u where u.doctor_id is not null)")
    public List<Doctor> getListBywithoutUserAccount1();

    //SELECT d  FROM Doctor d  LEFT JOIN User u ON d.id = u.doctor_id WHERE u.doctor_id IS NULL;
    //select d.id,d.fullname from cuddlesandtails.doctor d where d.id not in(SELECT u.doctor_id FROM cuddlesandtails.user u where u.doctor_id is not null);


    
    @Query("SELECT d FROM Doctor d WHERE d.employeestatus_id.id = 1 AND d.doctoravailabilitytype = 'housedoctor'")
    List<Doctor> findDoctorsByStatusAndAvailability();
    //SELECT * FROM cuddlesandtails.doctor where employeestatus_id = 1 and doctoravailabilitytype ="housedoctor";
    //"select d.id from Doctor d where d.employeestatus_id=1 and d.doctoravailabilitytype="housedoctor");
}

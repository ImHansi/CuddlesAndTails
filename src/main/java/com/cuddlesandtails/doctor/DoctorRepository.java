package com.cuddlesandtails.doctor;

import java.time.LocalDate;
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

    //sql way --> SELECT * FROM Doctor d WHERE d.id NOT IN (SELECT u.doctor_id FROM User u WHERE u.doctor_id IS NOT NULL);

    //SELECT d  FROM Doctor d  LEFT JOIN User u ON d.id = u.doctor_id WHERE u.doctor_id IS NULL;
    //select d.id,d.fullname from cuddlesandtails.doctor d where d.id not in(SELECT u.doctor_id FROM cuddlesandtails.user u where u.doctor_id is not null);


    
    @Query("SELECT d FROM Doctor d WHERE d.employeestatus_id.id = 1")
    List<Doctor> findDoctorsByStatus();
    //AND d.doctoravailabilitytype = 'housedoctor'
    //SELECT * FROM cuddlesandtails.doctor where employeestatus_id = 1 and doctoravailabilitytype ="housedoctor";
    //"select d.id from Doctor d where d.employeestatus_id=1 and d.doctoravailabilitytype="housedoctor");

    //create query to get 'working' doctors  to the given service
    @Query(value = "select d from Doctor d where d.specialization_id in " +"(select s from Service se join se.specializations s where se.id = :serviceId) " +"and d.employeestatus_id.id = 1")
    public List<Doctor> findWorkingDoctorsByService(@Param("serviceId") Integer serviceId);

    //create query to get available doctors today
    @Query("SELECT d FROM Doctor d " +"WHERE d.id IN (" +"   SELECT da.doctor_id.id FROM Doctoravailability da " +"   JOIN Availability a ON a.doctoravailability_id.id = da.id " +"   WHERE a.date = CURRENT_DATE" +") AND d.employeestatus_id.id = 1")
    List<Doctor> findDoctorsAvailableToday();

    //create a query to get working doctors to the given service and date
    @Query(value = "SELECT d FROM Doctor d " +"WHERE d.specialization_id IN (" +"   SELECT s FROM Service se JOIN se.specializations s WHERE se.id = :serviceId" +") AND d.id IN (" +"   SELECT da.doctor_id.id FROM Doctoravailability da " +"   JOIN Availability a ON a.doctoravailability_id.id = da.id " +"   WHERE a.date = :date" +") AND d.employeestatus_id.id = 1")
    public List<Doctor> findWorkingDoctorsAvailableByServiceAndDate(@Param("serviceId") Integer serviceId,@Param("date") LocalDate date);


    //query to get Todays the working doctors to a selected service 
    @Query("SELECT d FROM Doctor d " + "WHERE d.specialization_id.id IN (" + " SELECT ss.id FROM Service s " + " JOIN s.specializations ss " + " WHERE s.id = :serviceId" + ") " +
       "AND d.employeestatus_id.id = 1 " + "AND EXISTS (" + " SELECT a FROM Availability a " + " JOIN a.doctoravailability_id da " + " WHERE da.doctor_id.id = d.id " + "AND a.date = CURRENT_DATE" + ")")
    List<Doctor> findWorkingDoctorsByServiceAndToday(@Param("serviceId") Integer serviceId);


    //query to get working doctors by service and date
    @Query("SELECT d FROM Doctor d WHERE d.specialization_id.id IN (SELECT ss.id FROM Service s JOIN s.specializations ss WHERE s.id = :serviceId ) " +
       "AND d.employeestatus_id.id = 1 AND EXISTS ( SELECT a FROM Availability a JOIN a.doctoravailability_id da WHERE da.doctor_id.id = d.id AND a.date = :date )")
    List<Doctor> findWorkingDoctorsByServiceAndDate(@Param("serviceId") Integer serviceId,@Param("date") LocalDate date
);


    
}

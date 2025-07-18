package com.cuddlesandtails.appointment;

import java.time.LocalDate;
//import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface AppointmentRepository extends JpaRepository<Appointment,Integer>{

    @Query(value = "SELECT lpad(max(a.channelingno)+1,5,0) as channelingno FROM cuddlesandtails.appointment as a;", nativeQuery = true)
    public String getNextChannelingNumber();
    
 /*    @Query(value = "select a from Appointment a where date(dateofappointment) =?3 and (a.doctor_id.id = ?1 and a.appointmentstatus_id.id = ?2)")
    List<Appointment> getAppointmentReport(LocalDate selectDate, int doctor, int appointmentstatus); */

    @Query(value = "select * from Appointment a where a.dateofappointment =?3 and (a.doctor_id =?1 and a.appointmentstatus_id=?2)", nativeQuery = true)
    List<Appointment> getAppointmentReport(String selectDate, int doctor, int appointmentstatus);


    //query to get appointments to given date doctor and service
    @Query(value = "select a from Appointment a where a.dateofappointment =?1 and a.doctor_id.id=?3 and a.service_id.id=?2 and (a.appointmentstatus_id.id=1 or a.appointmentstatus_id.id=2 )")
    public List<Appointment> getAppinmentByDateServiceDoctor(LocalDate dateofappointment, Integer serviceid, Integer doctorid);

    //query to get appointments to the given date and service
    @Query(value = "select a from Appointment a where a.dateofappointment =?1 and a.service_id.id=?2 and (a.appointmentstatus_id.id=1 or a.appointmentstatus_id.id=2)")
    public List<Appointment> getAppinmentByDateService(LocalDate dateofappointment, Integer serviceid);

    //create query to get confirmed Appointments by given doctor id and todays date for consultation form
    @Query("select a from Appointment a" + " where a.doctor_id.id = :doctorId "+"and a.appointmentstatus_id.id = 2"+"and a.dateofappointment = :today")
    List<Appointment> getByDoctor(@Param("doctorId") Integer doctorId , @Param("today") LocalDate today);
    

    //create query to get confirmed Appointments by given service id and todays date for scan form
    @Query("select a from Appointment a" + " where a.service_id.id = :serviceId "+"and a.appointmentstatus_id.id = 2"+"and a.dateofappointment = :today")
    List<Appointment> getByService(@Param("serviceId") Integer serviceId , @Param("today") LocalDate today);
    

    //create query to get pending appointments
    @Query(value = "select a from Appointment a where a.appointmentstatus_id.id=1"+"and a.dateofappointment = :today")
    List<Appointment> getPendingAppointments(@Param("today") LocalDate today);

    //query to get appointments to the given date and doctor
    /* @Query("select a from Appointment a where a.dateofappointment =?1 and a.doctor_id.id=?2 and (a.appointmentstatus_id.id=1 or a.appointmentstatus_id.id=2)")
    List<Appointment> getAppinmentByDateDoctor(@Param("doctorId") Integer doctorId,@Param("dateofappointment")LocalDate dateofappointment);
 */

   //for the report of appointment to
    @Query("SELECT a FROM Appointment a " +"WHERE a.dateofappointment = :date " +"AND a.doctor_id.id = :doctorId ")
    List<Appointment> getAppointmentsByDoctorAndDate(@Param("doctorId") Integer doctorId,@Param("date") LocalDate date);

    //for the dashboard card
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentstatus_id.id = 2 AND MONTH(a.dateofappointment) = MONTH(CURRENT_DATE) AND YEAR(a.dateofappointment) = YEAR(CURRENT_DATE)")
    long countConfirmedAppointmentsThisMonth();

    //to get confirmed appointments which are scheduled for today
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentstatus_id.id = 2 AND a.dateofappointment = CURRENT_DATE")
    long countConfirmedAppointmentsToday();


    //for doctor availability status change
    @Query("SELECT a FROM Appointment a WHERE a.doctor_id.id = :doctorId AND a.dateofappointment = :date")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Integer doctorId, @Param("date") LocalDate date);


    //for doctor availability report to get the no of appointments according to the doctor , date service
    @Query("SELECT a FROM Appointment a WHERE a.dateofappointment = :date AND a.service_id.id = :serviceId AND a.doctor_id.fullname = :doctorId")
    List<Appointment> getAppointmentsByDateAndServiceAndDoctor(@Param("date") LocalDate date, @Param("serviceId") Integer serviceId, @Param("doctorId") String doctorId);


}

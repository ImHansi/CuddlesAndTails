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

    //create query to get confirmed Appointments by given service id
    @Query("select a from Appointment a where a.service_id.id = :serviceId and a.appointmentstatus_id.id = 2")
    List<Appointment> getByService(@Param("serviceId") Integer serviceId);
    

    //create query to get pending appointments
    @Query(value = "select a from Appointment a where a.appointmentstatus_id.id=1")
    List<Appointment> getPendingAppointments();

    //query to get appointments to the given date and doctor
    /* @Query("select a from Appointment a where a.dateofappointment =?1 and a.doctor_id.id=?2 and (a.appointmentstatus_id.id=1 or a.appointmentstatus_id.id=2)")
    List<Appointment> getAppinmentByDateDoctor(@Param("doctorId") Integer doctorId,@Param("dateofappointment")LocalDate dateofappointment);
 */

    @Query("SELECT a FROM Appointment a " +"WHERE a.dateofappointment = :date " +"AND a.doctor_id.id = :doctorId " +"AND (a.appointmentstatus_id.id = 1 OR a.appointmentstatus_id.id = 2)")
    List<Appointment> getAppointmentsByDoctorAndDate(@Param("doctorId") Integer doctorId,@Param("date") LocalDate date);
}

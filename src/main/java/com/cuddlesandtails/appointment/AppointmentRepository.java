package com.cuddlesandtails.appointment;

//import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AppointmentRepository extends JpaRepository<Appointment,Integer>{

    @Query(value = "SELECT lpad(max(a.channelingno)+1,5,0) as channelingno FROM cuddlesandtails.appointment as a;", nativeQuery = true)
    public String getNextChannelingNumber();
    
 /*    @Query(value = "select a from Appointment a where date(dateofappointment) =?3 and (a.doctor_id.id = ?1 and a.appointmentstatus_id.id = ?2)")
    List<Appointment> getAppointmentReport(LocalDate selectDate, int doctor, int appointmentstatus); */

    @Query(value = "select * from Appointment a where a.dateofappointment =?3 and (a.doctor_id =?1 and a.appointmentstatus_id=?2)", nativeQuery = true)
    List<Appointment> getAppointmentReport(String selectDate, int doctor, int appointmentstatus);
}

package com.cuddlesandtails.report;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

//import com.cuddlesandtails.appointment.Appointment;
import com.cuddlesandtails.employee.Employee;

public interface ReportRepository extends JpaRepository<Employee, Integer>{
    
    @Query(value="select e from Employee e where e.employeestatus_id.id=2")
    List<Employee> onleaveEmployeeList();

    @Query(value="select e from Employee e where e.employeestatus_id.id=?1 and e.designation_id.id=?2")
    List<Employee> employeeListBystatusDesignation(int status, int designation);

    //@Query(value="select a from Appointment a where a.dateofappointment=?1 and a.doctor_id.id=?2 and a.appointmentstatus_id=?3")
   /*  @Query(value ="SELECT a FROM Appointment a WHERE a.doctor_id.id = ?1 AND a.appointmentstatus_id.id = ?2")
    List<Appointment> appointmentListBydoctorstatus(int doctor, int appointmentstatus); */

    //select * from appointment where dateofappointment="2024-08-07" and doctor_id=1 and appointmentstatus_id=2;
}

package com.cuddlesandtails.appointment;

import java.time.*;

import org.hibernate.validator.constraints.Length;

import com.cuddlesandtails.doctor.Doctor;
import com.cuddlesandtails.pet.Owner;
import com.cuddlesandtails.pet.Pet;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity //apply as an entity class
@Table(name = "appointment") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Appointment {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "channelingno", unique = true)
    @NotNull
    @Length(max = 5)
    private String channelingno;

    @Column(name = "dateofappointment")
    @NotNull
    private LocalDate dateofappointment;

    @Column(name = "address")
    private String address;

    @Column(name = "email")
    private String email;

    @Column(name = "note")
    private String note;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;
    
    @Column(name = "lastmodifyuser_id")
    private Integer lastmodifyuser_id;
    
    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "lastmodifydatetime")
    private LocalDateTime lastmodifydatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "service_id",referencedColumnName = "id")
    private Service service_id;

    @ManyToOne
    @JoinColumn(name = "appointmenttime_id",referencedColumnName = "id")
    private Appointmenttime appointmenttime_id;

    @ManyToOne
    @JoinColumn(name = "taxi_id",referencedColumnName = "id")
    private Taxi taxi_id;

    @ManyToOne
    @JoinColumn(name = "doctor_id",referencedColumnName = "id")
    private Doctor doctor_id;

    @ManyToOne
    @JoinColumn(name = "pet_id",referencedColumnName = "id")
    private Pet pet_id;

    @ManyToOne
    @JoinColumn(name = "owner_id",referencedColumnName = "id")
    private Owner owner_id;

    @ManyToOne
    @JoinColumn(name = "appointmentstatus_id",referencedColumnName = "id")
    private Appointmentstatus appointmentstatus_id;

    
}

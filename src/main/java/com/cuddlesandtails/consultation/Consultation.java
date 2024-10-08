package com.cuddlesandtails.consultation;
import java.time.*;

import org.hibernate.validator.constraints.Length;

import com.cuddlesandtails.pet.Owner;
import com.cuddlesandtails.pet.Pet;
import com.cuddlesandtails.appointment.Appointment;
import com.cuddlesandtails.appointment.Recordstatus;
import com.cuddlesandtails.appointment.Service;
import com.cuddlesandtails.doctor.Doctor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity //apply as an entity class
@Table(name = "consultation") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Consultation {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "consulno", unique = true)
    @NotNull
    @Length(max = 4)
    private String consulno;

    @Column(name = "dateofconsultation")
    @NotNull
    private LocalDate dateofconsultation;

    @Column(name = "totalfee")
    @NotNull
    private String totalfee;

    @Column(name = "note")
    private String note;

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

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "servicefee")
    private String servicefee;

    @Column(name = "doctorfee")
    private String doctorfee;

    @ManyToOne
    @JoinColumn(name = "owner_id",referencedColumnName = "id")
    private Owner owner_id;

    @ManyToOne
    @JoinColumn(name = "pet_id",referencedColumnName = "id")
    private Pet pet_id;

    @ManyToOne
    @JoinColumn(name = "service_id",referencedColumnName = "id")
    private Service service_id;

    @ManyToOne
    @JoinColumn(name = "doctor_id",referencedColumnName = "id")
    private Doctor doctor_id;

    @ManyToOne
    @JoinColumn(name = "recordstatus_id",referencedColumnName = "id")
    private Recordstatus recordstatus_id;

    @OneToOne
    @JoinColumn(name = "appointment_id",referencedColumnName = "id")
    private Appointment appointment_id;
    

}

package com.cuddlesandtails.doctor;

import java.time.*;

import org.hibernate.validator.constraints.Length;

import com.cuddlesandtails.employee.EmployeeStatus;

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
@Table(name = "doctor") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Doctor {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "docno", unique = true)
    @NotNull
    @Length(max = 8)
    private String docno;

    @Column(name = "fullname")
    @NotNull
    private String fullname;

    @Column(name = "licenseno")
    @NotNull
    private String licenseno;

    @Column(name = "nic", unique = true)
    @NotNull
    @Length(max = 12, min = 10, message = "NicValue length must have 10 or 12")
    //@Pattern(regexp ="", message ="")
    private String nic;

    @Column(name = "mobileno", length = 10)
    @NotNull
    @Length(min = 10,max = 10,message = "Mobile number must have 10 numbers")
    private String mobileno;

    @Column(name = "gender")
    @NotNull
    private String gender;

    @Column(name = "dob")
    @NotNull
    private LocalDate dob;

    @Column(name = "landno", length = 10)
    @Length(min =10,max =10,message="land number must have 10 numbers")
    private String landno;

    @Column(name = "email")
    @NotNull
    private String email;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "note")
    private String note;

    @Column(name = "civilstatus") 
    @NotNull
    private String civilstatus;

    @Column(name = "doctorfee")
    private String doctorfee;

    @Column(name = "doctoravailabilitytype")
    @NotNull
    private String doctoravailabilitytype;

    @Column(name="addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;
    
    @Column(name="lastmodifydatetime")
    private LocalDateTime lastmodifydatetime;

    @Column(name="deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name="addeduser_id")
    private Integer addeduser_id;

    @Column(name="lastmodifyuser_id")
    private Integer lastmodifyuser_id;

    @Column(name="deleteuser_id")
    private Integer deleteuser_id;

    @ManyToOne
    @JoinColumn(name = "specialization_id",referencedColumnName = "id")
    private Specialization specialization_id;

    @ManyToOne
    @JoinColumn(name = "employeestatus_id",referencedColumnName = "id")
    private EmployeeStatus employeestatus_id;
    
}

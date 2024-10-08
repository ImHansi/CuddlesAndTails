package com.cuddlesandtails.vaccination;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

import com.cuddlesandtails.appointment.Recordstatus;
import com.cuddlesandtails.doctor.Doctor;
import com.cuddlesandtails.pet.Owner;
import com.cuddlesandtails.pet.Pet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vaccinationrecord")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Vaccinationrecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "vaccino", unique = true)
    @NotNull
    @Length(max = 8)
    private String vaccino;

    @Column(name = "dateofvaccination")
    @NotNull
    private LocalDate dateofvaccination;

    @Column(name = "dateofnextvaccination")
    @NotNull
    private LocalDate dateofnextvaccination;

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

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private Owner owner_id;

    @ManyToOne
    @JoinColumn(name = "vaccination_id", referencedColumnName = "id")
    private Vaccination vaccination_id;

    @ManyToOne
    @JoinColumn(name = "pet_id", referencedColumnName = "id")
    private Pet pet_id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    private Doctor doctor_id;

    @Column(name = "totalamount")
    @NotNull
    private Integer totalamount;

    @ManyToOne
    @JoinColumn(name = "recordstatus_id",referencedColumnName = "id")
    private Recordstatus recordstatus_id;

}

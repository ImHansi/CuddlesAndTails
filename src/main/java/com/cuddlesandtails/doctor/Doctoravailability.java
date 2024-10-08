package com.cuddlesandtails.doctor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="doctoravailability")
@Data
@NoArgsConstructor
@AllArgsConstructor



public class Doctoravailability {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "month")
    @NotNull
    private String month;

    @Column(name="startdate")
    @NotNull
    private LocalDate startdate ;

    @Column(name="enddate")
    private LocalDate enddate ;

    @ManyToOne
    @JoinColumn(name = "doctor_id",referencedColumnName = "id")
    private Doctor doctor_id;

    @OneToMany(mappedBy = "doctoravailability_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Availability> doctorhasavailabilityList;
    
}

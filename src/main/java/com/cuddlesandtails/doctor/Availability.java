package com.cuddlesandtails.doctor;

import java.sql.Time;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

@Entity
@Table(name="availability")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Availability {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "availableornot")
    @NotNull
    private Boolean availableornot;
 
    @Column(name = "date")
    @NotNull
    private LocalDate date;

    @Column(name = "strat_time")
    private Time strat_time;

    @Column(name = "end_time")
    private Time end_time;
 
    @ManyToOne(optional=false)//bcz even the null values may have in there
    @JsonIgnore //ignore property to stop recursion --> to block FK of many side
    @JoinColumn(name = "doctoravailability_id",referencedColumnName = "id")
    private Doctoravailability doctoravailability_id;
    
}

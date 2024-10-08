package com.cuddlesandtails.appointment;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity //apply as an entity class
@Table(name = "taxi") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Taxi {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "vehicleno")
    @NotNull
    private String vehicleno;

    @Column(name = "drivername")
    @NotNull
    private String drivername;

    @Column(name = "mobileno", length = 10)
    @NotNull
    @Length(min = 10,max = 10,message = "Mobile number must have 10 numbers")
    private String mobileno;

    @Column(name = "driverlicenseno")
    @NotNull
    private String driverlicenseno;
    

}

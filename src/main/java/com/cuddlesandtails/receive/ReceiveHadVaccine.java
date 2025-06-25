package com.cuddlesandtails.receive;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.cuddlesandtails.vaccine.Vaccine;
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

@Entity //apply as an entity class
@Table(name = "receive_has_vaccine") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class ReceiveHadVaccine {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "quantity")
    @NotNull
    private BigDecimal quantity;

    @Column(name = "price")
    @NotNull
    private BigDecimal price;

    @Column(name = "lineprice")
    @NotNull
    private BigDecimal lineprice;

    @Column(name = "batchno")
    @NotNull
    private String batchno;

    @Column(name = "manufactureddate")
    private LocalDate manufactureddate;

    @Column(name = "expiredate")
    private LocalDate expiredate;

    @ManyToOne(optional = true)
    @JoinColumn(name = "receive_id",referencedColumnName = "id")
    @JsonIgnore
    private Receive receive_id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "vaccine_id",referencedColumnName = "id")
    private Vaccine vaccine_id;
    
}

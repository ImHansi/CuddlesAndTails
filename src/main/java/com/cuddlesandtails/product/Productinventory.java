package com.cuddlesandtails.product;

import java.math.BigDecimal;
import java.time.LocalDate;

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
@Table(name = "productinventory") //for map with given table
@Data //generate setters getters
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Productinventory {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "manufactureddate")
    @NotNull
    private LocalDate manufactureddate;

    @Column(name = "expiredate")
    @NotNull
    private LocalDate expiredate;
    
    @Column(name = "totalqty")
    @NotNull
    private BigDecimal totalqty;
    
    @Column(name = "availableqty")
    @NotNull
    private BigDecimal availableqty;
    
    @Column(name = "removeqty")
    @NotNull
    private BigDecimal removeqty;
    
    @Column(name = "batch_no")
    @NotNull
    private String batch_no;
    
    @ManyToOne
    @JoinColumn(name = "product_id",referencedColumnName = "id")
    private Product product_id;

}

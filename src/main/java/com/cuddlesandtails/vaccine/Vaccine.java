package com.cuddlesandtails.vaccine;

import java.math.BigDecimal;
import java.time.*;

import com.cuddlesandtails.appointment.Recordstatus;
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
@Table(name = "vaccine") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Vaccine {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "code")
    @NotNull
    private String code;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "netweight")
    @NotNull
    private String netweight;

    @Column(name = "purchaseprice")
    @NotNull
    private BigDecimal purchaseprice;

    @Column(name = "salesprice")
    @NotNull
    private BigDecimal salesprice;

    @Column(name = "duration")
    private String duration;

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

    @ManyToOne
    @JoinColumn(name = "brand_id",referencedColumnName = "id")
    private Brand brand_id;

    @ManyToOne
    @JoinColumn(name = "recordstatus_id",referencedColumnName = "id")
    private Recordstatus recordstatus_id;

     
  

    
}

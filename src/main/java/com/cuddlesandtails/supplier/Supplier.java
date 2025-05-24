package com.cuddlesandtails.supplier;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //apply as an entity class
@Table(name="supplier") //map with the given table
@Data //generate setters and getters
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Supplier {
    
    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "supplier_no", unique = true)
    @NotNull
    @Length(max = 10)
    private String supplier_no;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "contactpersonname")
    @NotNull
    private String contactpersonname;

    @Column(name = "mobile")
    @NotNull
    @Length(max = 10)
    private String mobile;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "email")
    @NotNull
    private String email;

    @Column(name = "landno")
    @Length(max = 10)
    private String landno;

    @Column(name = "note")
    private String note;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "lastmodifydatetime")
    private LocalDateTime lastmodifydatetime;

    @Column( name = "deletedatetime")
    private LocalDateTime deletedatetime;
    
    @Column( name = "addeduser_id")
    @NotNull
    private Integer addeduser_id;
    
    @Column( name = "lastmodifyuser_id")
    private Integer lastmodifyuser_id;
    
    @Column( name = "deleteuser_id")
    private Integer deleteuser_id;
    
    @Column( name = "supplierbankname")
    @NotNull
    private String supplierbankname;
    
    @Column( name = "bankaccountno")
    @NotNull
    @Length(max = 18)
    private String bankaccountno;
    
    @Column( name = "bankname")
    @NotNull
    private String bankname;
    
    @Column( name = "branchtown")
    @NotNull
    private String branchtown;
    
    @ManyToOne
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id")
    private Supplierstatus supplierstatus_id; 

}

package com.cuddlesandtails.pet;

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
@Table(name = "owner") //for map with given table
@Data //generate setters and getters... etc
@NoArgsConstructor //generate default constructor
@AllArgsConstructor //all argument constructor

public class Owner {

    @Id //for pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id", unique = true) //to map with column
    private Integer id;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "mobile", length = 10)
    @NotNull
    @Length(min = 10,max = 10,message = "Mobile number must have 10 numbers")
    private String mobile;

    @Column(name = "nic", unique = true)
    @NotNull
    @Length(max = 12, min = 10, message = "NicValue length must have 10 or 12")
    //@Pattern(regexp ="", message ="")
    private String nic;

    @Column(name = "email")
    @NotNull
    private String email;

    @Column(name = "address")
    @NotNull
    private String address;
    


}

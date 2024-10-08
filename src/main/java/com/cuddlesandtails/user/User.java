package com.cuddlesandtails.user;

import java.time.LocalDateTime;
import java.util.Set;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

import com.cuddlesandtails.doctor.Doctor;
import com.cuddlesandtails.employee.Employee;
import com.cuddlesandtails.privilege.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor


public class User {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "id", unique = true)
private Integer id;

@Column(name = "username")
@NotNull
private String username;

@Column(name = "password")
@NotNull
private String password;

@Column(name = "email")
@NotNull
private String email;

@Column(name = "status")
private Boolean status;

@Column(name = "added_datetime")
@NotNull
private LocalDateTime added_datetime; 


@ManyToOne(optional = true)
@JoinColumn(name="employee_id",referencedColumnName="id")
private Employee employee_id;

@ManyToOne(optional = true)
@JoinColumn(name="doctor_id",referencedColumnName="id")
private Doctor doctor_id;


@ManyToMany
@JoinTable(name="user_has_role" , joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name= "role_id"))
private Set<Role> roles;

public User(Integer id,String username){
    this.id =id;
    this.username = username;
}
}

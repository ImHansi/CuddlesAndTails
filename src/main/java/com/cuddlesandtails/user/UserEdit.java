package com.cuddlesandtails.user;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserEdit {
    private Integer id;
    private String username;
    private String email;    
    private String newpassword;
    private String currentpassword;
    private byte[] image;
}

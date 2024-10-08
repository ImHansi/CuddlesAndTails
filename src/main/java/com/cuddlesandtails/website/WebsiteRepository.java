package com.cuddlesandtails.website;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cuddlesandtails.announcement.Announcement;

public interface WebsiteRepository extends JpaRepository<Announcement, Integer>{
    
}

'use client'
import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faSquareXTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import styles from "./Footer.module.css";
import hotelBasicInfo from "@/json objects/hotelBasicInfo.js";
import { useAppDispatch } from "@/redux store/hooks.js";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";


function Footer() {

   const router = useRouter();
   const dispatch = useAppDispatch();

   function loginClickHandler(event){
      event.preventDefault();
      const loginPageCalledFrom = 'Footer';
      const loginRedirectPage = '/profile-home-page';
      dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
      dispatch(updateLoginRedirectPage(loginRedirectPage));
      router.push('/login');
  }

   return(
    <div className={styles.footer}>
        <div className={styles.footerLeft}>
            <Image src={'/hotel-logo.jpg'} alt="hotel-logo" width={200} height={175} />
            <p>We make this belief a reality by putting clients first, leading with exceptional ideas, doing the right thing, and giving back.</p>
        </div>
        <div className={styles.footerContact}>
            <p className={styles.follow}>Follow Us</p>
            <p className={styles.social}>Social Media Channels</p>
            <ul>
               <li>
                  <Link href="https://www.facebook.com/">
                     <FontAwesomeIcon icon={faFacebook} /> Facebook
                  </Link>
               </li>
               <li>
                  <Link href="https://www.instagram.com/">
                     <FontAwesomeIcon icon={faInstagram} /> Instagram 
                  </Link>
               </li>
               <li>
                  <Link href="https://twitter.com/">
                     <FontAwesomeIcon icon={faSquareXTwitter} /> Twitter 
                  </Link>
               </li>
               <li>
                  <Link href="https://in.linkedin.com/">
                     <FontAwesomeIcon icon={faLinkedin} /> LinkedIn 
                  </Link>
               </li>
            </ul>

            <p className={styles.contact}>Contact Us</p>
            <ul>
               <li>
                  <FontAwesomeIcon icon={faPhone} /> {hotelBasicInfo.contactNo} 
               </li>
               <li>
                  <FontAwesomeIcon icon={faEnvelope} /> {hotelBasicInfo.emailId}
               </li>
            </ul>

            <p className={styles.address}>Address</p>
            <ul>
               <li>
               <FontAwesomeIcon icon={faLocationDot} /> {hotelBasicInfo.address}
               </li>
            </ul>
        </div>

        <div className={styles.menuItem}>
            <p className={styles.menu}>Menu</p>
            <ul>
               <li>
                  <Link href="/">Home</Link>
               </li>
               <li>
                  <Link href="/rooms-suites/">Rooms and Suites</Link>
               </li>
               <li>
                  <Link href="/dining">Dining</Link>
               </li>
               <li>
                  <Link href="/meetings-events/">Events/ Meeting Rooms</Link>
               </li>
               <li>
                  <Link href="/facility-in-our-hotel">Facilities</Link>
               </li>
               <li>
                  <Link href="/about">About</Link>
               </li>
               <li>
                  <Link href="/contactUs">Contact Us</Link>
               </li>
               <li>
                  <Link onClick={loginClickHandler} href="/login">Login</Link>
               </li>
               <li>
                  <Link href="/register">Register</Link>
               </li>
               <li>
                  <Link href="/cart">My Cart</Link>
               </li>
            </ul>
        </div>
    </div>
   ); 
}

export default Footer;
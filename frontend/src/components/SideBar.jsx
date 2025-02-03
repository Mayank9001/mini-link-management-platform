import React, { useState } from 'react';
import styles from './SideBar.module.css';
import cuvette from '../assets/cuvette.png';

const SideBar = ({isDashboard, isSettings, isLinks, isAnalytics}) => {
  const [isActive, setIsActive] = useState({
    dashboard:isDashboard,
    settings:isSettings,
    links:isLinks,
    analytics:isAnalytics,
  });

  return (
    <>
      <div className={styles.main}>
        <div className={styles.image}>
          <img src={cuvette} alt='cuvette'/>
        </div>
        <div className={styles.access}>
          <div className={styles.dla}>
            <a href='/dashboard' className={`${styles.sideitem} ${isActive.dashboard ? styles.active : ""}`}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8333 7.2583L11.3891 3.80164C10.9991 3.49823 10.5191 3.3335 10.025 3.3335C9.53083 3.3335 9.05081 3.49823 8.6608 3.80164L4.21663 7.2583C3.9495 7.46604 3.73338 7.73208 3.58476 8.03609C3.43615 8.34011 3.35897 8.67407 3.35913 9.01247V15.0125C3.35913 15.4545 3.53473 15.8784 3.84729 16.191C4.15985 16.5035 4.58377 16.6791 5.0258 16.6791H15.0258C15.4678 16.6791 15.8917 16.5035 16.2043 16.191C16.5169 15.8784 16.6925 15.4545 16.6925 15.0125V9.01247C16.6925 8.32664 16.375 7.67914 15.8333 7.2583Z"
                  stroke={isActive.dashboard ? "#1B48DA" : "#3B3C51"}
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.3333 12.5C11.4916 13.6108 8.50663 13.6108 6.66663 12.5"
                  stroke={isActive.dashboard ? "#1B48DA" : "#3B3C51"}
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={styles.dashboard}>Dashboard</span>
            </a>
            <a href='/links' className={`${styles.sideitem} ${isActive.links ? styles.active : ""}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33337 11.6633C8.60494 11.9405 8.92908 12.1607 9.28681 12.311C9.64455 12.4613 10.0287 12.5387 10.4167 12.5387C10.8047 12.5387 11.1889 12.4613 11.5466 12.311C11.9043 12.1607 12.2285 11.9405 12.5 11.6633L15.8334 8.32997C16.3712 7.77442 16.6691 7.02974 16.6628 6.25655C16.6565 5.48335 16.3466 4.74361 15.7998 4.19686C15.2531 3.65011 14.5133 3.34018 13.7401 3.3339C12.9669 3.32762 12.2223 3.62551 11.6667 4.16331L11.25 4.57997" stroke={isActive.links ? "#1B48DA" : "#3B3C51"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.6667 8.33669C11.395 8.05972 11.0708 7.83972 10.7131 7.68952C10.3554 7.53933 9.9713 7.46198 9.58333 7.46198C9.19536 7.46198 8.81129 7.53933 8.45357 7.68952C8.09586 7.83972 7.77168 8.05972 7.5 8.33669L4.16666 11.67C3.62886 12.2256 3.33098 12.9703 3.33726 13.7434C3.34353 14.5166 3.65347 15.2564 4.20022 15.8031C4.74696 16.3499 5.48671 16.6598 6.2599 16.6661C7.0331 16.6724 7.77778 16.3745 8.33333 15.8367L8.75 15.42" stroke={isActive.links ? "#1B48DA" : "#3B3C51"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.links}>Links</span>
            </a>
            <a href='/analytics' className={`${styles.sideitem} ${isActive.analytics ? styles.active : ""}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 14.1667L7.5 9.16671L10.8333 12.5L17.5 5.83337" stroke={isActive.analytics ? "#1B48DA" : "#3B3C51"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.6666 5.83337H17.5V11.6667" stroke={isActive.analytics ? "#1B48DA" : "#3B3C51"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              <span className={styles.analytics}>Analytics</span>
            </a>
          </div>
          <div className={styles.settings}>
            <a href='/settings' className={`${styles.sideitem} ${isActive.settings ? styles.active : ""}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.60417 3.5975C8.95917 2.13417 11.0408 2.13417 11.3958 3.5975C11.4491 3.81733 11.5535 4.02148 11.7006 4.19333C11.8477 4.36518 12.0332 4.49988 12.2422 4.58645C12.4512 4.67303 12.6776 4.70904 12.9032 4.69156C13.1287 4.67407 13.3469 4.60359 13.54 4.48583C14.8258 3.7025 16.2983 5.17417 15.515 6.46083C15.3974 6.65388 15.327 6.87195 15.3096 7.09731C15.2922 7.32267 15.3281 7.54897 15.4146 7.75782C15.5011 7.96666 15.6356 8.15215 15.8073 8.29921C15.9789 8.44627 16.1829 8.55075 16.4025 8.60417C17.8658 8.95917 17.8658 11.0408 16.4025 11.3958C16.1827 11.4491 15.9785 11.5535 15.8067 11.7006C15.6348 11.8477 15.5001 12.0332 15.4135 12.2422C15.327 12.4512 15.291 12.6776 15.3084 12.9032C15.3259 13.1287 15.3964 13.3469 15.5142 13.54C16.2975 14.8258 14.8258 16.2983 13.5392 15.515C13.3461 15.3974 13.1281 15.327 12.9027 15.3096C12.6773 15.2922 12.451 15.3281 12.2422 15.4146C12.0333 15.5011 11.8479 15.6356 11.7008 15.8073C11.5537 15.9789 11.4492 16.1829 11.3958 16.4025C11.0408 17.8658 8.95917 17.8658 8.60417 16.4025C8.55106 16.1826 8.44673 15.9783 8.29969 15.8063C8.15264 15.6344 7.96704 15.4996 7.75801 15.413C7.54899 15.3264 7.32245 15.2904 7.09688 15.308C6.87131 15.3256 6.65309 15.3962 6.46 15.5142C5.17417 16.2975 3.70167 14.8258 4.485 13.5392C4.60258 13.3461 4.67296 13.1281 4.6904 12.9027C4.70785 12.6773 4.67187 12.451 4.58539 12.2422C4.49892 12.0333 4.36438 11.8479 4.19273 11.7008C4.02107 11.5537 3.81714 11.4492 3.5975 11.3958C2.13417 11.0408 2.13417 8.95917 3.5975 8.60417C3.81733 8.5509 4.02148 8.44648 4.19333 8.29941C4.36518 8.15233 4.49988 7.96676 4.58645 7.75779C4.67303 7.54882 4.70904 7.32236 4.69156 7.09685C4.67407 6.87133 4.60359 6.65313 4.48583 6.46C3.7025 5.17417 5.17417 3.70167 6.46083 4.485C7.29417 4.99167 8.37417 4.54333 8.60417 3.5975Z" stroke={isActive.settings ? "#1B48DA" : "#3B3C51"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5Z" stroke={isActive.settings ? "#1B48DA" : "#3B3C51"} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Settings</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBar
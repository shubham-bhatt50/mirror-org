'use client';

import { useState } from 'react';
import {
  IconChartBar,
  IconLayoutGrid,
  IconSettings,
  IconBell,
  IconBook,
  IconMessageCircle,
  IconChevronDown,
  IconUsers,
  IconApps,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [orgOpen, setOrgOpen] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { name: 'Content', icon: IconLayoutGrid, href: '/' },
    { name: 'Analytics', icon: IconChartBar, href: '/analytics' },
    { name: 'Settings', icon: IconSettings, href: '/settings' },
  ];

  return (
    <div className={`${styles.sidebar} ${!isOpen ? styles.sidebarCollapsed : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        {isOpen && (
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <span className={styles.logoText}>M</span>
            </div>
            <span className={styles.brandText}>Mirror</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.appsButton}
        >
          <IconApps size={24} />
        </button>
      </div>

      {/* Organization Selector */}
      {isOpen && (
        <div className={styles.orgSelector}>
          <button
            onClick={() => setOrgOpen(!orgOpen)}
            className={styles.orgButton}
          >
            <IconUsers size={24} />
            <span style={{ flex: 1, textAlign: 'left' }}>Fox Rehabilitation</span>
            <IconChevronDown
              size={20}
              style={{ transform: orgOpen ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
            />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              <Icon className={styles.navIcon} />
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {isOpen && (
        <div className={styles.bottomSection}>
          <button className={styles.bottomButton}>
            <div className={styles.avatar}>
              <span className={styles.avatarText}>S</span>
            </div>
            <span className={styles.userName}>Shubham Bhatt</span>
          </button>
          <button className={styles.bottomButton}>
            <IconBell className={styles.bottomIcon} />
            <span>Notifications</span>
          </button>
          <button className={styles.bottomButton}>
            <IconBook className={styles.bottomIcon} />
            <span>Resources</span>
          </button>
          <button className={styles.bottomButton}>
            <IconMessageCircle className={styles.bottomIcon} />
            <span>Chat</span>
          </button>
          <div className={styles.footer}>
            <img
              src="https://cdn.whatfix.com/prod/53cedd46-5870-4e3b-9cfd-afe1f3d01fd0/a2be7ca6-6eb3-4c8c-9638-5a15c36f4df2/nav-logo.svg"
              alt="Whatfix"
              className={styles.footerLogo}
            />
          </div>
        </div>
      )}
    </div>
  );
}


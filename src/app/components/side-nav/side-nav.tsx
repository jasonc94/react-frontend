import {
  IconHome,
  IconRocket,
  IconDeviceGamepad2,
  IconVideoMinus,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconSwitchHorizontal,
  IconLogout,
  IconLibrary,
} from '@tabler/icons-react';
import classes from './side-nav.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

const navs = [
  { link: '/', label: 'Home', icon: IconHome },
  // { link: '/stock', label: 'Stock', icon: IconRocket },
  { link: '/games', label: 'Games', icon: IconDeviceGamepad2 },
  { link: '/squad-connect', label: 'Squad Connect', icon: IconVideoMinus },
  { link: '/tutorials', label: 'Tutorials', icon: IconLibrary },
  // { link: '', label: 'Authentication', icon: Icon2fa },
  // { link: '', label: 'Other Settings', icon: IconSettings },
];

export default function SideNav({ closeNav }: { closeNav: () => void }) {
  const [active, setActive] = useState('Billing');
  const location = useLocation();

  const onLinkClick = useCallback(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      closeNav();
    }
  }, [closeNav]);

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    const result = navs.find((item) => item.link === `/${path}`);
    if (result) setActive(result?.label);
  }, [location]);

  return (
    <>
      <div className={classes.navbarMain}>
        {navs.map((item) => (
          <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            to={item.link}
            key={item.label}
            onClick={onLinkClick}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div> */}
    </>
  );
}

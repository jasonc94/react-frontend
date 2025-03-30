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
} from '@tabler/icons-react';
import classes from './side-nav.module.scss';
import { Link } from 'react-router-dom';
import { useCallback, useState } from 'react';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/stock', label: 'Stock', icon: IconRocket },
  { link: '/games', label: 'Games', icon: IconDeviceGamepad2 },
  { link: '/squad-connect', label: 'Squad Connect', icon: IconVideoMinus },
  { link: '', label: 'Databases', icon: IconDatabaseImport },
  { link: '', label: 'Authentication', icon: Icon2fa },
  { link: '', label: 'Other Settings', icon: IconSettings },
];

export default function SideNav({ closeNav }: { closeNav: () => void }) {
  const [active, setActive] = useState('Billing');

  const onLinkClick = useCallback(
    (label: string) => {
      console.log('window', window.innerWidth);
      console.log('document', document.documentElement.clientWidth);

      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        closeNav();
      } else {
        setActive(label);
      }
    },
    [closeNav]
  );

  return (
    <>
      <div className={classes.navbarMain}>
        {data.map((item) => (
          <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            to={item.link}
            key={item.label}
            onClick={() => onLinkClick(item.label)}
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

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  AppBar,
  IconButton,
  Link as MuiLink,
  Typography,
  Button,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import {
  Headers,
  Header,
  HeaderBrand,
  HeaderContent,
  HeaderRightZone,
  HeaderProps,
  HeaderSearch,
  Icon,
  Row,
  HeaderLinkZone,
  HeaderSocialsZone,
  LinkList,
  LinkListItem,
} from 'design-react-kit';
import 'typeface-titillium-web';

import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import {
  AppBarStyle,
  ToolBarStyle,
  BoxTitleStyle,
  BoxMenuStyle,
  BoxImgStyle,
  LogoStyle,
  LogoStyleV,
  HeaderStyle,
  HeaderBrandStyle,
  LinkStyle,
  HeaderTextStyle,
} from './styles';
import { Link } from 'react-router-dom';
class HeaderBarProps {
  mode?: 'compact' | 'full' = 'compact';
}

const HeaderBar = (props: HeaderBarProps) => {
  const { t } = useTranslation();
  // const actualstate = useSelector(state => state);
  // const route = useLocation();
  // console.log({ route, actualstate });
  const regioneImg = '/img/logo_regione_veneto.png';
  const arpavImg = '/img/logo_arpav.png';
  const snpaImg = '/img/logo_SNPA.png';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  return (
    <Headers>
      <Header theme="light" type="slim" style={HeaderStyle}>
        <HeaderContent>
          <HeaderBrand style={HeaderBrandStyle} href="/">
            <b className="green">{t('app.header.acronymMeaning')}</b>
          </HeaderBrand>
          <HeaderRightZone>
            <HeaderLinkZone>
              <LinkList>
                <LinkListItem href="/info" style={LinkStyle}>
                  {t('app.header.menu.info')}
                </LinkListItem>
                <LinkListItem href="/privacy" style={LinkStyle}>
                  {t('app.header.menu.privacyPolicy')}
                </LinkListItem>
                <LinkListItem href="/data" style={LinkStyle}>
                  {t('app.header.menu.dataPolicy')}
                </LinkListItem>
              </LinkList>
            </HeaderLinkZone>
          </HeaderRightZone>
        </HeaderContent>
      </Header>
      {props.mode === 'full' ? (
        <Header theme="light" type="center">
          <HeaderContent>
            <HeaderBrand>
              <img
                src={require('../../../assets/img/logo_arpav.png')}
                alt="arpav"
              ></img>
            </HeaderBrand>
            <HeaderRightZone style={HeaderTextStyle}>
              <HeaderSocialsZone>
                <ul>
                  <li>
                    <a aria-label="Facebook" href="#" target="_blank">
                      <Icon icon="it-facebook" />
                    </a>
                  </li>
                  <li>
                    <a aria-label="Github" href="#" target="_blank">
                      <Icon icon="it-github" />
                    </a>
                  </li>
                  <li>
                    <a aria-label="Twitter" href="#" target="_blank">
                      <Icon icon="it-twitter" />
                    </a>
                  </li>
                </ul>
              </HeaderSocialsZone>
              <HeaderSearch iconName="it-search" label="Cerca" />
            </HeaderRightZone>
          </HeaderContent>
        </Header>
      ) : (
        <></>
      )}
    </Headers>
  );
};
export default HeaderBar;

//

//

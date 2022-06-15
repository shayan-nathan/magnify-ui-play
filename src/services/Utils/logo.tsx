import ImageSalesforce from 'assets/images/salesforce.svg'
import ImageMarketo from 'assets/images/marketo.svg'
import ImagePendo from 'assets/images/pendo.svg'
import ImageIntercom from 'assets/images/intercom.svg'
import ImageGainsight from 'assets/images/gainsight.svg'
import ImageSkilljar from 'assets/images/skilljar.svg'
import ImageZendesk from 'assets/images/zendesk.svg'
import ImageWalkMe from 'assets/images/walkme.svg'
import ImageZuara from 'assets/images/zuara.svg'
import ImageGoogleAnalytics from 'assets/images/google_analytics.svg'
import ImageSlack from 'assets/images/slack.svg'
// imports for svg format
import { ReactComponent as IconSalesforce } from 'assets/images/salesforce.svg'
import { ReactComponent as IconMarketo } from 'assets/images/marketo.svg'
import { ReactComponent as IconPendo } from 'assets/images/pendo.svg'
import { ReactComponent as IconIntercom } from 'assets/images/intercom.svg'
import { ReactComponent as IconGainsight } from 'assets/images/gainsight.svg'
import { ReactComponent as IconSkilljar } from 'assets/images/skilljar.svg'
import { ReactComponent as IconZendesk } from 'assets/images/zendesk.svg'
import { ReactComponent as IconWalkMe } from 'assets/images/walkme.svg'
import { ReactComponent as IconZuara } from 'assets/images/zuara.svg'
import { ReactComponent as IconGoogleAnalytics } from 'assets/images/google_analytics.svg'
import { ReactComponent as IconSlack } from 'assets/images/slack.svg'

function sortImages(name: string, svg?: boolean) {
  let icon
  switch (name.toLowerCase()) {
    case 'salesforce':
      icon = svg ? <IconSalesforce /> : ImageSalesforce
      break
    case 'marketo':
      icon = svg ? <IconMarketo /> : ImageMarketo
      break
    case 'pendo':
      icon = svg ? <IconPendo /> : ImagePendo
      break
    case 'intercom':
      icon = svg ? <IconIntercom /> : ImageIntercom
      break
    case 'gainsight':
      icon = svg ? <IconGainsight /> : ImageGainsight
      break
    case 'skilljar':
      icon = svg ? <IconSkilljar /> : ImageSkilljar
      break
    case 'zendesk':
      icon = svg ? <IconZendesk /> : ImageZendesk
      break
    case 'walkme':
      icon = svg ? <IconWalkMe /> : ImageWalkMe
      break
    case 'zuara':
      icon = svg ? <IconZuara /> : ImageZuara
      break
    case 'google_analytics':
      icon = svg ? <IconGoogleAnalytics /> : ImageGoogleAnalytics
      break
    case 'slack':
      icon = svg ? <IconSlack /> : ImageSlack
      break

    default:
      // default icon
      icon = svg ? <IconSlack /> : ImageSlack
      break
  }
  return icon
}
const getIcon = (name: string): string => {
  return sortImages(name) as string
}

const getSVGIcon = (name: string) => {
  return sortImages(name, true)
}

export const LogoService = {
  getIcon,
  getSVGIcon,
}

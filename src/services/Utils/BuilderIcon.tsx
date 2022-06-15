import { FC } from 'react'
import { ReactComponent as IconSegments } from 'assets/icons/playbookBuilder/segment.svg'
import React from 'react'

import { ReactComponent as IconCreateOpportunity } from 'assets/icons/playbookBuilder/create_opportunity.svg'
import { ReactComponent as IconIfElse } from 'assets/icons/playbookBuilder/if_else.svg'
import { ReactComponent as IconLoop } from 'assets/icons/playbookBuilder/loop.svg'
import { ReactComponent as IconSendEmail } from 'assets/icons/playbookBuilder/send_email.svg'
import { ReactComponent as IconTimeDelay } from 'assets/icons/playbookBuilder/time_delay.svg'
import { ReactComponent as IconUpdateLead } from 'assets/icons/playbookBuilder/update_lead.svg'
import { ReactComponent as IconWaitForTrigger } from 'assets/icons/playbookBuilder/wait_for_trigger.svg'

import { ReactComponent as IconNotification } from 'assets/icons/playbookBuilder/notification.svg'
import { ReactComponent as IconAlert } from 'assets/icons/playbookBuilder/alert.svg'
import { ReactComponent as IconAddContact } from 'assets/icons/playbookBuilder/add_contact.svg'
import { ReactComponent as IconSendMessage } from 'assets/icons/playbookBuilder/send_message.svg'

/* This utils can't be used for the moment because not all the svg are real svg, those that have an image inside are not well displayed */
/* Can be used like this: <BuilderIcon name={`${getNormalize(data.name)}`} options={{ width: 55, height: 55 }} /> */
interface BuilderIconProps {
  name: string
  options?: {
    width?: string | number
    height?: string | number
    color?: string
    draggable?: boolean
  }
}
const iconTypes: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  update_lead: IconUpdateLead,
  segments: IconSegments,
  create_opportunity: IconCreateOpportunity,
  if_else: IconIfElse,
  loop: IconLoop,
  send_email: IconSendEmail,
  time_delay: IconTimeDelay,
  wait_for_trigger: IconWaitForTrigger,
  add_contact: IconAddContact,
  alert: IconAlert,
  notification: IconNotification,
  send_message: IconSendMessage,
}

export const BuilderIcon: FC<BuilderIconProps> = (props: BuilderIconProps) => {
  const { name, options } = props
  let Icon = iconTypes[name] || iconTypes['segments']
  return <Icon {...options} />
}

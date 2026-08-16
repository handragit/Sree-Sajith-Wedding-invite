import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ children, size = 24, ...props }: IconProps) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden={props["aria-label"] ? undefined : true} {...props}>{children}</svg>;
}

const strokeProps = { stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 2 };

export function MajesticonMapMarker(props: IconProps) {
  return <Icon {...props}><path {...strokeProps} d="M19 10c0 3.976-7 11-7 11s-7-7.024-7-11 3.134-7 7-7 7 3.024 7 7z"/><circle {...strokeProps} cx="12" cy="10" r="3"/></Icon>;
}

export function MajesticonCalendar(props: IconProps) {
  return <Icon {...props}><path {...strokeProps} d="M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M4 9V7a2 2 0 0 1 2-2h2M4 9h16m0 0V7a2 2 0 0 0-2-2h-2m0 0V3m0 2H8m0-2v2"/></Icon>;
}

export function MajesticonClipboard(props: IconProps) {
  return <Icon {...props}><path {...strokeProps} d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M8 5v0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0M8 5v0a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v0"/></Icon>;
}

export function MajesticonChatText(props: IconProps) {
  return <Icon {...props}><path {...strokeProps} d="M8 9h8m-8 3h8m-8 3h3m10-3a9 9 0 0 1-13.815 7.605L3 21l1.395-4.185A9 9 0 1 1 21 12z"/></Icon>;
}

export function MajesticonMail(props: IconProps) {
  return <Icon {...props}><path {...strokeProps} d="m7 9 3.75 3a2 2 0 0 0 2.5 0L17 9m4 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/></Icon>;
}

export function MajesticonGift(props: IconProps) {
  return <Icon {...props}><path {...strokeProps} d="M4 11v9h16v-9M2 7h20v4H2zM12 7v13M12 7H7.5a2.5 2.5 0 1 1 0-5C10 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 1 0 0-5C14 2 12 7 12 7z"/></Icon>;
}

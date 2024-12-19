interface NavLinkProps {
  path: string;
  label: string;
  options?: {
    href: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
}

interface BottomNavProps {
  path: string;
  svgContent: string;
  label: string;
  options?: {
    href: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
}

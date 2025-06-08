declare module "*.svg" {
  import * as React from "react";
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "enhanced-fluid-bottom-navigation-bar" {
  import * as React from "react";

  export interface TabConfig {
    name: string;
    label: string;
    icon: (props: { focused: boolean }) => React.ReactNode;
  }

  export interface FluidNavigatorProps {
    backgroundColor?: string;
    tabs: TabConfig[];
  }

  export const FluidNavigator: React.FC<FluidNavigatorProps>;
}

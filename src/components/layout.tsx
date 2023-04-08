import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <div>
        <header>header</header>
      </div>
      <main>{children}</main>
      <footer>footer</footer>
    </>
  );
}

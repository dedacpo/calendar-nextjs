import Calendar from "@/components/calendar";

export default function Home() {
  return (
    <>
      <Calendar />
    </>
  );
}

export async function getStaticProps() {
  return { props: { isStatic: true } }
}
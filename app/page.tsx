import Hero from "@/components/hero";

export default function IndexPage() {
  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Hero />
      </div>
    </div>
  );
}

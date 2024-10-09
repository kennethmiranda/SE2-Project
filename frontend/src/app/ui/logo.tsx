import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/src/components/ui/fonts";

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-theme`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[40px]">TMS System</p>
    </div>
  );
}
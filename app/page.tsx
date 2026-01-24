import { Button } from "@/components/ui/button";
import Logout from "@/module/auth/components/logout";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center h-screen">
        <Logout>
            <Button>Logout</Button>
        </Logout>
    </div>
  );
}

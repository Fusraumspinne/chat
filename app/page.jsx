import Button from "@/components/Button";
import InputField from "@/components/InputField";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Enter your Details</p>

      <form>
        <InputField placeholder={"E-Mail"}/>
        <InputField placeholder={"Password"}/>

        <Button text={"Login"}/>

        <Link href={"/signup"}> Don't have an account? <span>Sign Up here</span></Link>
      </form>
    </div>
  );
}

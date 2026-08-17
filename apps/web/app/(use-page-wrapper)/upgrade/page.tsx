import { redirect } from "next/navigation";

const ServerPage = async () => {
  return redirect("/event-types");
};

export default ServerPage;

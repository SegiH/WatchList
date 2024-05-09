import { getApiDocs } from "@/lib/swagger"

import ReactSwagger from "./react-swagger"

import "./swagger.css";

export default async function IndexPage() {
     const spec = await getApiDocs();

     return (
          <section className="container" style={{ backgroundColor: "white !important" }} >
               <ReactSwagger spec={spec} />
          </section>
     )
}
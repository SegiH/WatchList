"use client"
const useRouter = require("next/navigation").useRouter;

export default function ErrorPage() {
     const router = useRouter();

     return (
          <div className="foregroundColor">
               <span>
                    <img src="/404.jpg" alt="Uh oh. Something went wrong" />

                    <br /><br />

                    <a className="clickable foregroundColor largeText" onClick={() => router.push("/")}>Go Home</a>
               </span>
          </div>
     )
}
"use client"

import SwaggerUI from "swagger-ui-react"
import { useEffect, useState } from 'react';
import "swagger-ui-react/swagger-ui.css"

type Props = {
     spec: Record<string, any>
}

function ReactSwagger({ spec }: Props) {
     const [isClient, setIsClient] = useState(false);

     useEffect(() => {
          const newIsClient = !window.location.href.endsWith("api-doc") && !window.location.href.endsWith("api-doc/") ? true : false;

          setIsClient(newIsClient);
     }, []);

     // @ts-ignore - SwaggerUI is not typed
     if (isClient) {
          return <></>
     } else {
          return <SwaggerUI spec={spec} />
     }
}

export default ReactSwagger
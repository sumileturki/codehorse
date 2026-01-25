"use client";

import { LayoutProp } from "@/lib/types";
import { QueryClient,QueryClientProvider} from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({children}:LayoutProp){
    const [client] = useState(()=> new QueryClient());

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}
import React, { ReactNode } from "react";

type ProviderItem = {
    Provider: React.ComponentType<{ value: any; children?: ReactNode }>;
    value: any;
};

export default function ComposeProviders({ providers, children }: { providers: ProviderItem[]; children: ReactNode }) {
    return providers.reduceRight((acc, providerItem) => {
        const { Provider, value } = providerItem;
        return <Provider value={value}>{acc}</Provider>;
    }, children as ReactNode);
}
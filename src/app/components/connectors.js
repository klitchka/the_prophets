import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { ArgentMobileConnector } from "starknetkit/argentMobile"

export const connectors = [
    new InjectedConnector({options:{id: "argentX"}}),
    new WebWalletConnector(),
    new ArgentMobileConnector()
];
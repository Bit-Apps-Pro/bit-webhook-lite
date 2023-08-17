import "../css/app.css";
import "./bootstrap";

import { ChakraProvider } from "@chakra-ui/react";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import BroadcastWebhook from "./Components/webhook/BroadcastWebhook";
import Master from "./Layouts/Master";

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => {
        const page = resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        );
        page.layout = page.layout || Master;
        return page;
    },
    setup({ el, App, props }) {
        if (props.initialPage.props?.ssr) {
            hydrateRoot(
                el,
                <ChakraProvider>
                    <App {...props} />
                    <BroadcastWebhook />
                </ChakraProvider>
            );
        } else {
            createRoot(el).render(
                <ChakraProvider>
                    <App {...props} />
                    <BroadcastWebhook />
                </ChakraProvider>
            );
        }
    },
    progress: {
        color: "#4B5563",
    },
});
